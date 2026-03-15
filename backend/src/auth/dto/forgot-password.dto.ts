import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 忘记密码 DTO
 */
export class ForgotPasswordDto {
  @ApiProperty({ description: '注册邮箱', example: 'user@example.com' })
  @IsEmail()
  @IsString()
  email: string;
}
