import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';

@Module({
  providers: [ComentariosService],
  controllers: [ComentariosController]
})
export class ComentariosModule {}
