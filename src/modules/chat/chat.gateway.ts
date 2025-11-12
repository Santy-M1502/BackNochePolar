import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { WsAuthGuard } from '../autenticacion/authenticacion-ws.guard';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;
  private clients = new Map<string, string>();

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  handleConnection(client: any) {
    const token = client.handshake?.headers?.authorization?.split(' ')[1];
    if (!token) {
      client.disconnect(true);
      throw new WsException('Falta token');
    }

    try {
      const user = this.jwtService.verify(token);
      client.data.user = user;
      this.clients.set(user._id, client.id);
      console.log('✅ Usuario conectado:', user._id);
    } catch (err) {
      console.error('❌ Token inválido:', err.message);
      client.disconnect(true);
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: any,
    @MessageBody() { to, text }: { to: string; text: string }
  ) {
    const from = client.data.user._id;
    await this.chatService.sendMessage(from, to, text);

    const targetSocketId = this.clients.get(to);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('receive_message', { from, text });
    }
  }
}
