import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionGuard } from './autenticacion.guard';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AutenticacionController } from './autenticacion.controller';

@Module({
  imports: [
    UsuariosModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AutenticacionService, AutenticacionGuard],
  controllers:[AutenticacionController],
  exports: [JwtModule, AutenticacionService, AutenticacionGuard],
})
export class AutenticacionModule {}
