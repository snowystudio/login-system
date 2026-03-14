import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * 认证控制器
 * 处理用户认证相关的 HTTP 请求
 */
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 用户注册接口
   * POST /api/auth/register
   * 
   * @param registerDto 注册信息（邮箱、密码）
   * @returns 用户信息和 JWT Token
   */
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 次/分钟
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * 用户登录接口
   * POST /api/auth/login
   * 
   * @param loginDto 登录信息（邮箱、密码）
   * @returns 用户信息和 JWT Token
   */
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 次/分钟
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 退出登录接口
   * POST /api/auth/logout
   * 
   * 注意：由于使用 JWT（无状态），退出登录主要由前端处理（删除 Token）
   * 如需实现 Token 黑名单机制，可在此添加 Redis 缓存逻辑
   * 
   * @returns 成功消息
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // TODO: Phase 3 - 实现 Token 黑名单机制
    return { message: '已退出登录' };
  }
}
