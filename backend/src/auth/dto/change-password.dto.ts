import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 修改密码 DTO
 */
export class ChangePasswordDto {
  @ApiProperty({ description: '当前密码', example: 'OldPass123!' })
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @ApiProperty({ description: '新密码', example: 'NewSecurePass456!' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  newPassword: string;
}
