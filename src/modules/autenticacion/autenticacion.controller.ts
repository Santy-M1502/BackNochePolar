import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AutenticacionGuard } from './autenticacion.guard';
import { AutenticacionService } from './autenticacion.service';

@Controller('auth')
export class AutenticacionController {
  constructor(private authService: AutenticacionService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AutenticacionGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getUpdatedProfile(req.user.sub);
  }
}