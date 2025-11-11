import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AutenticacionGuard } from '../autenticacion/autenticacion.guard';

@Controller('chat')
@UseGuards(AutenticacionGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendMessage(@Body() body: { from: string; to: string; text: string }) {
    return this.chatService.sendMessage(body.from, body.to, body.text);
  }

  @Get(':user1/:user2')
  getConversation(@Param('user1') user1: string, @Param('user2') user2: string) {
    return this.chatService.getConversation(user1, user2);
  }



  
}
