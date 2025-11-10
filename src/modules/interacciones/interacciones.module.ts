import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './schema/like.schema';
import { Guardado, GuardadoSchema } from './schema/guardado.schema';
import { InteraccionesService } from './interacciones.service';
import { InteraccionesController } from './interacciones.controller';
import { Publicacion, PublicacionSchema } from '../publicaciones/schema/publicaciones.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: Guardado.name, schema: GuardadoSchema },
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
  ],
  providers: [InteraccionesService],
  controllers: [InteraccionesController],
  exports: [InteraccionesService],
})
export class InteraccionesModule {}
