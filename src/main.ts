import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем валидацию входящих данных
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.HTTP_PORT || 3001);
}

bootstrap();
