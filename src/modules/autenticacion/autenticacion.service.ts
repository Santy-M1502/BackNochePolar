import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AutenticacionService {
  constructor(
    private usersService: UsuariosService,
    private jwtService: JwtService,
  ) { }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);

    if (!user || !(await bcrypt.compare(pass, user.claveHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username
    };

  return {
    access_token: await this.jwtService.signAsync(payload),
  };
}

async getUpdatedProfile(userId: string) {
  const user = await this.usersService.findById(userId);
  if (!user) {
    throw new UnauthorizedException('Usuario no encontrado');
  }
  
  const { claveHash, ...result } = user.toObject();
  return result;
}
}