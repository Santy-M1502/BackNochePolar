import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import serverless from 'serverless-http';

let cachedServer: any = null;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors();
    await app.init(); // no app.listen()
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

const serverlessHandler = async (event: any, context: any) => {
  const server = await bootstrapServer();
  const proxy = serverless(server);
  return proxy(event, context);
};

export default serverlessHandler;
