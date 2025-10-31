import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors();

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`Server running on port ${port}`);

    // --- DEBUG helpers (temporal) ---
    // 1) Añadir ruta directa usando el servidor Express subyacente
    const server = app.getHttpAdapter().getInstance();
    if (server && typeof server.get === 'function') {
      server.get('/__health', (_req, res) => res.json({ ok: true }));
      console.log('Health route /__health added (raw express).');
    } else {
      console.log('No express instance detected (adapter diferente).');
    }

    // 2) Listado de rutas registradas (solo Express)
    if (server && server._router && Array.isArray(server._router.stack)) {
      console.log('Registered Express routes (debug):');
      server._router.stack.forEach((layer: any) => {
        if (layer.route && layer.route.path) {
          const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(',');
          console.log(`${methods} ${layer.route.path}`);
        } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
          // nested router
          layer.handle.stack.forEach((l: any) => {
            if (l.route && l.route.path) {
              const methods = Object.keys(l.route.methods).map(m => m.toUpperCase()).join(',');
              console.log(`${methods} ${l.route.path}`);
            }
          });
        }
      });
    } else {
      console.log('No router stack found to list routes.');
    }

    // --- end DEBUG ---
  } catch (err) {
    console.error('Bootstrap error:', err);
    process.exit(1);
  }
}

bootstrap();
