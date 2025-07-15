import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: false,
  }));

  app.enableCors(); // ✅ bật CORS

  app.listen(process.env.PORT ?? 3000, '0.0.0.0')
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
