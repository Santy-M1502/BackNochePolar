import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PublicacionesModule } from './modules/publicaciones/publicaciones.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),
    DatabaseModule,
    AutenticacionModule, 
    UsuariosModule,
    PublicacionesModule
  ],
  controllers:[AppController],
  providers: [AppService]
})
export class AppModule { }
