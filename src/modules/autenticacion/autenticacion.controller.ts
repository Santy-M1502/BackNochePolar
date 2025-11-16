import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AutenticacionGuard } from './autenticacion.guard';
import { AutenticacionService } from './autenticacion.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AutenticacionController {
  constructor(private authService: AutenticacionService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AutenticacionGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getUpdatedProfile(req.user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Post('autorizar')
  async autorizar(@Body('token') token: string) {
    const payload = this.authService.validateToken(token);
    if (!payload) throw new UnauthorizedException('Token inválido o expirado');

    return this.authService.getUpdatedProfile(payload.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refrescar')
  async refrescar(@Body('token') token: string) {
    const payload = this.authService.validateToken(token);
    if (!payload) throw new UnauthorizedException('Token inválido o expirado');

    const nuevoToken = await this.authService.refreshToken(payload);
    return { access_token: nuevoToken };
  }
}
