import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
      origin: '*',
      methods: 'GET, PUT, POST, DELETE, PATCH',
      credentials: false,
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token'
  });
  
  await app.listen(envs.PORT);
  
}
bootstrap();
