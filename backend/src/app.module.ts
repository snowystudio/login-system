import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // 配置模块 - 加载环境变量
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 速率限制模块配置
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000, // 60 秒
        limit: 5,   // 5 次请求
      }],
    }),
    
    // JWT 模块配置
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-key-change-me',
      signOptions: { 
        expiresIn: process.env.JWT_EXPIRATION || '2h',
        algorithm: 'HS256',
      },
    }),
    
    // 功能模块
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
