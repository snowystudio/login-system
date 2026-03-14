import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // 导出服务供其他模块使用
})
export class UsersModule {}
