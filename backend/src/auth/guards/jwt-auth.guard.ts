import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

/**
 * JWT 认证守卫
 * 用于保护需要登录的路由
 * 使用方式：在 Controller 方法上使用 @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  /**
   * 执行认证
   * @param context 执行上下文
   * @returns 认证结果
   */
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('未提供认证 Token');
    }

    try {
      // 验证 Token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'default-secret-key-change-me',
      });

      // 将用户信息附加到请求对象
      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token 无效或已过期');
    }
  }

  /**
   * 从 Authorization Header 中提取 Token
   * 格式：Bearer <token>
   */
  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
