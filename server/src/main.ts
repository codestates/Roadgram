import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
require('dotenv').config();

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(process.env.KEY),
    cert: readFileSync(process.env.CERT)
  }
  const app = await NestFactory.create(AppModule,{httpsOptions});
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
