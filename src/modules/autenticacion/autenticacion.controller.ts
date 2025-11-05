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
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AutenticacionController {
  constructor(private authService: AutenticacionService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { identifier: string; password: string }) {
    return this.authService.signIn(body.identifier, body.password);
  }

  @UseGuards(AutenticacionGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getUpdatedProfile(req.user.sub);
  }
}