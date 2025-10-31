import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { CloudinaryModule } from '../modules/cloudinary/cloudinary.module';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports: [CloudinaryModule]
})
export class PublicacionesModule {}
