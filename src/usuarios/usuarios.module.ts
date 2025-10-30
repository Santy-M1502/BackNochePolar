import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { CloudinaryModule } from 'src/config/cloudinary.module';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [CloudinaryModule]
})
export class UsuariosModule {}
