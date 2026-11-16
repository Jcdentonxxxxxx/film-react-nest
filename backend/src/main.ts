import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { AppConfig } from './config/app.config.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  const config = app.get<AppConfig>('CONFIG');
  await app.listen(config.server.port);
}
bootstrap();
