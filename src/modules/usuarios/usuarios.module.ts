import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsuariosService } from './usuarios.service';
import { Usuario, UsuarioSchema } from './schema/usuarios.schema';
import { UsuariosController } from './usuarios.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    CloudinaryModule,
    JwtModule,
  ],
  providers: [UsuariosService],
  exports: [UsuariosService],
  controllers: [UsuariosController],
})
export class UsuariosModule {}