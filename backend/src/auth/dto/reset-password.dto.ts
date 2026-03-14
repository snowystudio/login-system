import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 重置密码 DTO
 */
export class ResetPasswordDto {
  @ApiProperty({ description: '重置 Token', example: 'uuid-token' })
  @IsString()
  token: string;

  @ApiProperty({ description: '新密码', example: 'NewResetPass789!' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  newPassword: string;
}
