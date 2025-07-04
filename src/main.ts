import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', ' https://f423-222-252-30-194.ngrok-free.app'],
  }); // ✅ bật CORS

  app.listen(8000, '0.0.0.0')
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
