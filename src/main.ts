import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import serverless from 'serverless-http';

dotenv.config();

let cachedServer: any = null;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors();
    await app.init(); // importante, no app.listen()
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

// handler exportado para Lambda
export const handler = async (event: any, context: any) => {
  const server = await bootstrapServer();
  const proxy = serverless(server);
  return proxy(event, context);
};
