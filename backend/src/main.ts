import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除未定义的属性
      forbidNonWhitelisted: true, // 禁止未定义的属性
      transform: true, // 自动转换类型
    }),
  );

  // 启用 CORS（开发环境）
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? false : '*',
    credentials: true,
  });

  // 全局 API 前缀
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 应用启动在 http://localhost:${port}`);
}
bootstrap();
