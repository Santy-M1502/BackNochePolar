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
    await app.init(); // inicializa Nest, no app.listen()
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

// export named, Lambda espera un handler
export const handler = async (event: any, context: any) => {
  const server = await bootstrapServer();
  const proxy = serverless(server);
  return proxy(event, context);
};
