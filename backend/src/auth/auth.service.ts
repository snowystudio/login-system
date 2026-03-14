import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * 认证服务层
 * 处理用户注册、登录、Token 生成等认证逻辑
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   * @param registerDto 注册信息
   * @returns 用户信息和 JWT Token
   */
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // 创建用户（UsersService 中已处理密码加密）
    const user = await this.usersService.create(email, password);

    // 生成 JWT Token
    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  /**
   * 用户登录
   * @param loginDto 登录信息
   * @returns 用户信息和 JWT Token
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 查找用户
    const user = await this.usersService.findByEmail(email);

    // 安全提示：不泄露用户是否存在 - 统一错误信息
    if (!user || !user.passwordHash || !await this.usersService.validatePassword(password, user.passwordHash)) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 生成 JWT Token
    const token = this.generateToken(user);

    // 返回清理后的用户信息
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * 生成 JWT Token
   * @param user 用户信息
   * @returns JWT Token 字符串
   */
  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // 使用 HS256 算法，过期时间 2 小时（在 app.module.ts 中配置）
    return this.jwtService.sign(payload);
  }

  /**
   * 验证 JWT Token
   * @param token JWT Token
   * @returns Token 中的用户信息
   */
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token 无效或已过期');
    }
  }
}
