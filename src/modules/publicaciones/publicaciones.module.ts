import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './schema/publicaciones.schema';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports:[
    MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]),
    CloudinaryModule,
    ],
  exports:[PublicacionesService]
})
export class PublicacionesModule {}
