import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: AutenticacionService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();

    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) return false;

    const user = this.authService.validateToken(token);
    if (!user) return false;

    client.data.user = user;
    return true;
  }
}
