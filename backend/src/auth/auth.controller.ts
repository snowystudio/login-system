import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  Request, 
  Get, 
  Query,
  Delete,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordStrengthQueryDto } from './dto/password-strength.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * 认证控制器
 * 处理用户认证相关的 HTTP 请求
 */
@ApiTags('认证')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '密码强度不足或邮箱已存在' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '邮箱或密码错误' })
  async login(@Body() loginDto: LoginDto, @Request() req: any) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '退出登录' })
  async logout() {
    return { message: '已退出登录' };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '修改当前密码' })
  @ApiResponse({ status: 200, description: '密码修改成功' })
  @ApiResponse({ status: 400, description: '密码强度不足或与历史密码重复' })
  @ApiResponse({ status: 401, description: '原密码错误' })
  async changePassword(@Request() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.changePassword(req.user.sub, changePasswordDto, ipAddress, userAgent);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '忘记密码 - 发送重置链接' })
  @ApiResponse({ status: 200, description: '重置链接已发送' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Request() req: any) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.forgotPassword(forgotPasswordDto, ipAddress, userAgent);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '重置密码' })
  @ApiResponse({ status: 200, description: '密码重置成功' })
  @ApiResponse({ status: 400, description: 'Token 无效、已使用或过期' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Request() req: any) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.resetPassword(resetPasswordDto, ipAddress, userAgent);
  }

  @Get('password-strength')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '检查密码强度' })
  @ApiResponse({ status: 200, description: '返回密码强度等级、分数和详细要求' })
  async checkPasswordStrength(@Query() query: PasswordStrengthQueryDto) {
    return this.authService.checkPasswordStrength(query.password);
  }

  @Get('password-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '获取密码修改历史' })
  @ApiResponse({ status: 200, description: '返回最近 20 条密码修改记录' })
  async getPasswordHistory(@Request() req: any) {
    const history = await this.authService.getPasswordHistory(req.user.sub);
    return { history };
  }

  @Delete('password-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除密码历史（GDPR 合规）' })
  @ApiResponse({ status: 200, description: '密码历史已删除' })
  async deletePasswordHistory(@Request() req: any) {
    return this.authService.deletePasswordHistory(req.user.sub);
  }

  @Post('force-password-change')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '强制用户修改密码（管理员专用）' })
  @ApiResponse({ status: 200, description: '已标记强制修改' })
  async forcePasswordChange(@Body() body: { userId: string; reason: 'risk_detected' | 'policy_violation' | 'admin_request' }) {
    return this.authService.forcePasswordChange(body.userId, body.reason);
  }

  @Get('force-password-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '检查强制修改密码状态' })
  @ApiResponse({ status: 200, description: '返回是否需要强制修改密码' })
  async checkForcePasswordStatus(@Request() req: any) {
    return this.authService.checkForcePasswordStatus(req.user.sub);
  }
}
