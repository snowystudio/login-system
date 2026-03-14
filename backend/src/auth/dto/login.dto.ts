import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * 登录请求 DTO
 * 用于验证用户登录输入
 */
export class LoginDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
