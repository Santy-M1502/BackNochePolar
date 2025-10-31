import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import serverless from 'serverless-http';
import * as dotenv from 'dotenv';
dotenv.config();

let cachedServer: any = null;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

// DEFAULT EXPORT que Lambda requiere
export default async function handler(event: any, context: any) {
  const server = await bootstrapServer();
  const proxy = serverless(server);
  return proxy(event, context);
}
