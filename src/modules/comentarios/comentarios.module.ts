import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { Comentario, ComentarioSchema } from './schema/comentario.schema';
import { Publicacion, PublicacionSchema } from '../publicaciones/schema/publicaciones.schema';
import { JwtModule } from '@nestjs/jwt';
import { AutenticacionGuard } from '../autenticacion/autenticacion.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comentario.name, schema: ComentarioSchema },
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [ComentariosService, AutenticacionGuard],
  controllers: [ComentariosController],
})
export class ComentariosModule {}
