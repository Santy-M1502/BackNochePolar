import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AutenticacionGuard } from '../autenticacion/autenticacion.guard';

@Controller('chat')
@UseGuards(AutenticacionGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversation/:partnerId')
  async getConversation(@Req() req, @Param('partnerId') partnerId: string) {
    const userId = req.user.sub;
    return this.chatService.getConversation(userId, partnerId);
  }

  @Post('send')
  async sendMessage(
    @Req() req,
    @Body() body: { to: string; text: string }
  ) {
    const userId = req.user.sub;
    return this.chatService.sendMessage(userId, body.to, body.text);
  }
}
