import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  UseGuards,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from '../autenticacion/authenticacion-ws.guard';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
@UseGuards(WsAuthGuard)
export class ChatGateway {
  @WebSocketServer() server: Server;

  private clients = new Map<string, string>();

  constructor(private chatService: ChatService) {}

  handleConnection(client: any) {
    const user = client.data.user;
    this.clients.set(user._id, client.id);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: any,
    @MessageBody() { to, text }: { to: string; text: string }
  ) {
    const from = client.data.user._id;

    await this.chatService.sendMessage(from, to, text);

    const targetSocketId = this.clients.get(to);

    if (targetSocketId) {
      this.server.to(targetSocketId).emit('receive_message', {
        from,
        text,
      });
    }
  }
}