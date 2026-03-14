import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordValidatorService } from '../services/password-validator.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

/**
 * 认证服务层
 * 处理用户注册、登录、Token 生成、密码管理等认证逻辑
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordValidator: PasswordValidatorService,
  ) {}

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // 验证密码复杂度
    const validation = this.passwordValidator.validateComplexity(password);
    if (!validation.valid) {
      throw new BadRequestException({
        code: 'PASSWORD_TOO_WEAK',
        message: '密码强度不足',
        requirements: validation.missingRequirements,
      });
    }

    // 创建用户
    const user = await this.usersService.create(email, password);

    // 生成 JWT Token
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user || !user.passwordHash || !await this.usersService.validatePassword(password, user.passwordHash)) {
      // 记录失败日志
      await this.passwordValidator.logPasswordChange(
        user?.id || 'unknown',
        'manual',
        ipAddress,
        userAgent,
        false,
        '登录失败 - 密码错误',
      );
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const token = this.generateToken(user);
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expiresIn: '2h',
    };
  }

  /**
   * 修改密码
   */
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    ipAddress: string,
    userAgent: string,
  ) {
    const { currentPassword, newPassword } = dto;

    // 验证新密码复杂度
    const validation = this.passwordValidator.validateComplexity(newPassword);
    if (!validation.valid) {
      await this.passwordValidator.logPasswordChange(
        userId,
        'manual',
        ipAddress,
        userAgent,
        false,
        '密码复杂度不足',
      );
      throw new BadRequestException({
        code: 'PASSWORD_TOO_WEAK',
        message: '密码强度不足',
        requirements: validation.missingRequirements,
      });
    }

    // 获取用户
    const user = await this.usersService.findById(userId);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('用户不存在');
    }

    // 验证原密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      await this.passwordValidator.logPasswordChange(
        userId,
        'manual',
        ipAddress,
        userAgent,
        false,
        '原密码错误',
      );
      throw new UnauthorizedException('原密码错误');
    }

    // 检查密码历史
    const historyCheck = await this.passwordValidator.checkPasswordHistory(userId, newPassword);
    if (!historyCheck.valid) {
      await this.passwordValidator.logPasswordChange(
        userId,
        'manual',
        ipAddress,
        userAgent,
        false,
        '使用历史密码',
      );
      throw new BadRequestException({
        code: 'PASSWORD_REUSED',
        message: historyCheck.error,
      });
    }

    // 加密新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // 更新密码
    await this.usersService.updatePassword(userId, newPasswordHash);

    // 保存密码历史
    await this.passwordValidator.savePasswordHistory(userId, newPasswordHash);

    // 记录成功日志
    await this.passwordValidator.logPasswordChange(
      userId,
      'manual',
      ipAddress,
      userAgent,
      true,
    );

    // 计算密码强度
    const strength = this.passwordValidator.calculateStrength(newPassword);

    return {
      message: '密码修改成功',
      strength: strength.strength,
      score: strength.score,
      nextChangeRecommended: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 天后
    };
  }

  /**
   * 忘记密码 - 发送重置链接
   */
  async forgotPassword(dto: ForgotPasswordDto, ipAddress: string, userAgent: string) {
    const { email } = dto;

    // 查找用户（不泄露邮箱是否存在）
    const user = await this.usersService.findByEmail(email);
    
    if (user) {
      // 生成重置 token
      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 分钟过期

      // 删除未过期的旧 token
      await this.usersService.deleteUnusedResetTokens(user.id);

      // 创建新 token
      await this.usersService.createResetToken(user.id, token, expiresAt);

      // TODO: 发送邮件（生产环境需实现）
      // await this.emailService.sendPasswordResetEmail(email, token);
      
      // 记录日志
      await this.passwordValidator.logPasswordChange(
        user.id,
        'reset',
        ipAddress,
        userAgent,
        true,
        '重置链接已生成',
      );
    }

    // 统一返回消息（防邮箱枚举）
    return { message: '如果邮箱存在，已发送重置链接' };
  }

  /**
   * 重置密码
   */
  async resetPassword(dto: ResetPasswordDto, ipAddress: string, userAgent: string) {
    const { token, newPassword } = dto;

    // 验证新密码复杂度
    const validation = this.passwordValidator.validateComplexity(newPassword);
    if (!validation.valid) {
      throw new BadRequestException({
        code: 'PASSWORD_TOO_WEAK',
        message: '密码强度不足',
        requirements: validation.missingRequirements,
      });
    }

    // 验证 token
    const resetToken = await this.usersService.findResetToken(token);
    if (!resetToken) {
      throw new BadRequestException('无效的 token');
    }

    if (resetToken.used) {
      throw new BadRequestException('Token 已使用');
    }

    if (new Date(resetToken.expiresAt) < new Date()) {
      throw new BadRequestException('Token 已过期');
    }

    // 获取用户
    const user = await this.usersService.findById(resetToken.userId);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 检查密码历史
    const historyCheck = await this.passwordValidator.checkPasswordHistory(user.id, newPassword);
    if (!historyCheck.valid) {
      throw new BadRequestException(historyCheck.error);
    }

    // 加密新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // 更新密码
    await this.usersService.updatePassword(user.id, newPasswordHash);

    // 保存密码历史
    await this.passwordValidator.savePasswordHistory(user.id, newPasswordHash);

    // 标记 token 为已使用
    await this.usersService.markResetTokenUsed(token);

    // 记录成功日志
    await this.passwordValidator.logPasswordChange(
      user.id,
      'reset',
      ipAddress,
      userAgent,
      true,
    );

    return { message: '密码重置成功' };
  }

  /**
   * 检查密码强度
   */
  checkPasswordStrength(password: string) {
    return this.passwordValidator.calculateStrength(password);
  }

  /**
   * 获取密码历史
   */
  async getPasswordHistory(userId: string) {
    return this.passwordValidator.getPasswordHistory(userId);
  }

  /**
   * 删除密码历史（GDPR 合规）
   */
  async deletePasswordHistory(userId: string) {
    await this.passwordValidator.deletePasswordHistory(userId);
    return { message: '密码历史已删除' };
  }

  /**
   * 强制用户修改密码（管理员功能）
   */
  async forcePasswordChange(userId: string, reason: 'risk_detected' | 'policy_violation' | 'admin_request') {
    await this.usersService.forcePasswordChange(userId, true, reason);
    return { message: '已标记强制修改' };
  }

  /**
   * 检查强制修改密码状态
   */
  async checkForcePasswordStatus(userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      forceChangeRequired: user?.forcePasswordChange || false,
      reason: user?.forceChangeReason || null,
    };
  }

  /**
   * 生成 JWT Token
   */
  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * 验证 JWT Token
   */
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token 无效或已过期');
    }
  }
}
