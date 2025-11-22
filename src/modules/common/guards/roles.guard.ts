import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException("Token inválido o inexistente");
    }

    if (user.rol !== 'admin') {
      throw new ForbiddenException("No tienes permisos de administrador");
    }

    return true;
  }
}
