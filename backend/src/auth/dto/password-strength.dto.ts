import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 密码强度查询 DTO
 */
export class PasswordStrengthQueryDto {
  @ApiPropertyOptional({ description: '待检测的密码', example: 'MyPassword123!' })
  @IsString()
  @IsOptional()
  password?: string;
}
