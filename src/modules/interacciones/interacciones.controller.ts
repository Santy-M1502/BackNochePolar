import { Controller, Post, Param, Get, Body } from '@nestjs/common';
import { InteraccionesService } from './interacciones.service';

@Controller('interacciones')
export class InteraccionesController {
  constructor(private readonly interaccionesService: InteraccionesService) {}

  @Post('like/:usuarioId/:publicacionId')
  async toggleLike(@Param('usuarioId') usuarioId: string, @Param('publicacionId') publicacionId: string) {
    return this.interaccionesService.toggleLike(usuarioId, publicacionId);
  }

  @Get('likes/:usuarioId')
  async obtenerLikesDeUsuario(@Param('usuarioId') usuarioId: string) {
    return this.interaccionesService.obtenerLikesDeUsuario(usuarioId);
  }

  @Post('guardado/:usuarioId/:publicacionId')
  async toggleGuardado(@Param('usuarioId') usuarioId: string, @Param('publicacionId') publicacionId: string) {
    return this.interaccionesService.toggleGuardado(usuarioId, publicacionId);
  }

  @Get('guardados/:usuarioId')
  async obtenerGuardadas(@Param('usuarioId') usuarioId: string) {
    return this.interaccionesService.obtenerGuardadas(usuarioId);
  }
}
