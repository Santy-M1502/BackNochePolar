import * as dotenv from 'dotenv';
dotenv.config();
import { IoAdapter } from '@nestjs/platform-socket.io';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://front-noche-polar.vercel.app',
      'https://backnochepolar.onrender.com',
      'http://26.39.81.87:4200',
      'http://192.168.1.87:4200',
      'http://192.168.56.1:4200',
      'http://127.0.0.1:4200'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3000);
}
bootstrap();
