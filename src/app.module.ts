import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PublicacionesModule } from './modules/publicaciones/publicaciones.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteraccionesModule } from './modules/interacciones/interacciones.module';
import { ComentariosModule } from './modules/comentarios/comentarios.module';
import { ChatModule } from './modules/chat/chat.module';
import { EstadisticasController } from './modules/estadisticas/estadisticas.controller';
import { EstadisticasService } from './modules/estadisticas/estadisticas.service';
import { EstadisticasModule } from './modules/estadisticas/estadisticas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),
    DatabaseModule,
    AutenticacionModule, 
    UsuariosModule,
    PublicacionesModule,
    InteraccionesModule,
    ComentariosModule,
    ChatModule,
    EstadisticasModule
  ],
  controllers:[AppController],
  providers: [AppService]
})
export class AppModule { }
