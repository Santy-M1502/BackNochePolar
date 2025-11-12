import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionGuard } from './autenticacion.guard';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    UsuariosModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AutenticacionService, AutenticacionGuard],
  exports: [JwtModule, AutenticacionService, AutenticacionGuard],
})
export class AutenticacionModule {}
