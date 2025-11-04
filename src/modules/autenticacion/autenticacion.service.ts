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

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('No existe una cuenta con ese email');
    }

    const passwordCorrecta = await bcrypt.compare(pass, user.claveHash);

    if (!passwordCorrecta) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUpdatedProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const { claveHash, ...result } = user.toObject();
    return result;
  }
}
