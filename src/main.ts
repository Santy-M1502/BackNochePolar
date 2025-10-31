import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Pipes y CORS
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors();

    // Puerto que Render asigna
    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`Server running on port ${port}`);
  } catch (err) {
    console.error('Bootstrap error:', err);
    process.exit(1);
  }
}

bootstrap();
