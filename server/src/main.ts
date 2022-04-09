import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  
  const config = new DocumentBuilder()
  .setTitle('Roadgram')
  .setDescription('Roadgram API Document')
  .setVersion('1.0')
  .addTag('roadgram')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {defaultModelsExpandDepth: -1}
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
