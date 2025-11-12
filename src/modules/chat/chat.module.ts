import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Conversation, ConversationSchema } from './schema/chat.schema';
import { JwtService } from '@nestjs/jwt';
import { AutenticacionService } from '../autenticacion/autenticacion.service';
import { AutenticacionModule } from '../autenticacion/autenticacion.module';

@Module({
  imports: [
    AutenticacionModule,
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatModule]
})
export class ChatModule {}
