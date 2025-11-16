import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AutenticacionService {
  constructor(
    private usersService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async signIn(identifier: string, password: string) {
    const user = await this.usersService.findByEmailOrUsername(identifier);

    if (!user) {
      throw new BadRequestException('No existe una cuenta con ese usuario o correo');
    }

    const passwordOk = await bcrypt.compare(password, user.claveHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      rol: user.perfil,  
    };

    const token = await this.jwtService.signAsync(payload, { expiresIn: '15m' });

    const { claveHash, cloudinaryPublicId, ...userData } = user.toObject();

    return {
      ...userData,
      access_token: token,
    };
  }

  async getUpdatedProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('Usuario no encontrado');

    const { claveHash, ...result } = user.toObject();
    return result;
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }

  async refreshToken(payload: any) {
    const { sub, username, email, rol } = payload;
    return this.jwtService.signAsync({ sub, username, email, rol }, { expiresIn: '15m' });
  }
}
