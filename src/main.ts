import * as dotenv from 'dotenv';
dotenv.config();
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Opciones CORS más completas (incluye OPTIONS y headers)
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://front-noche-polar.vercel.app',
      'https://backnochepolar.onrender.com',
      'https://back-noche-polar.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Middleware para asegurarnos de responder preflight antes que cualquier otra cosa
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new IoAdapter(app));

  // IMPORTANTE: usar el puerto que el host provee
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 App listening on port ${port}`);
}
bootstrap();
