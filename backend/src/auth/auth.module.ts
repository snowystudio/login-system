import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule, // 导入用户模块
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-key-change-me',
      signOptions: { 
        expiresIn: '2h', // Token 过期时间
        algorithm: 'HS256', // 签名算法
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // 导出服务供其他模块使用
})
export class AuthModule {}
