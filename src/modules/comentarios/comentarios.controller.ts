import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { AutenticacionGuard } from '../autenticacion/autenticacion.guard';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import type { Request } from 'express';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @UseGuards(AutenticacionGuard)
  @Post('publicacion/:publicacionId')
  async comentarPublicacion(
    @Param('publicacionId') publicacionId: string,
    @Body() body: CreateComentarioDto,
    @Req() req: Request,
  ) {
    const usuarioId = (req.user as any)?._id;
    if (!usuarioId) throw new UnauthorizedException('Usuario no autenticado');
    return this.comentariosService.comentarPublicacion(
      usuarioId,
      publicacionId,
      body.texto,
    );
  }

  @UseGuards(AutenticacionGuard)
  @Post(':comentarioId/responder')
  async responderComentario(
    @Param('comentarioId') comentarioId: string,
    @Body() body: CreateComentarioDto,
    @Req() req: Request,
  ) {
    const usuarioId = (req.user as any)?._id;
    if (!usuarioId) throw new UnauthorizedException('Usuario no autenticado');
    return this.comentariosService.responderComentario(
      usuarioId,
      comentarioId,
      body.texto,
    );
  }

  // ✅ Dar like a comentario
  @UseGuards(AutenticacionGuard)
  @Post(':comentarioId/like')
  async darLike(@Param('comentarioId') comentarioId: string, @Req() req: Request) {
    const usuarioId = (req.user as any)?._id;
    if (!usuarioId) throw new UnauthorizedException('Usuario no autenticado');
    return this.comentariosService.darLike(comentarioId, usuarioId);
  }

  // ✅ Quitar like
  @UseGuards(AutenticacionGuard)
  @Delete(':comentarioId/like')
  async quitarLike(@Param('comentarioId') comentarioId: string, @Req() req: Request) {
    const usuarioId = (req.user as any)?._id;
    if (!usuarioId) throw new UnauthorizedException('Usuario no autenticado');
    return this.comentariosService.quitarLike(comentarioId, usuarioId);
  }

  // ✅ Obtener comentarios de una publicación (paginado)
  @Get('publicacion/:publicacionId')
  async obtenerPorPublicacion(
    @Param('publicacionId') publicacionId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('orden') orden?: 'recientes' | 'antiguos' | 'populares',
  ) {
    return this.comentariosService.obtenerPorPublicacion(
      publicacionId,
      Number(limit) || 10,
      Number(offset) || 0,
      orden || 'recientes',
    );
  }

  // ✅ Obtener respuestas de un comentario (paginado)
  @Get(':comentarioId/respuestas')
  async obtenerRespuestas(
    @Param('comentarioId') comentarioId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.comentariosService.obtenerRespuestas(
      comentarioId,
      Number(limit) || 10,
      Number(offset) || 0,
    );
  }

  // ✅ Obtener comentarios por usuario
  @Get('usuario/:usuarioId')
  async obtenerPorUsuario(
    @Param('usuarioId') usuarioId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.comentariosService.obtenerPorUsuario(
      usuarioId,
      Number(limit) || 10,
      Number(offset) || 0,
    );
  }

  // ✅ Obtener últimos comentarios globales
  @Get('ultimos')
  async obtenerUltimos(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.comentariosService.obtenerUltimos(
      Number(limit) || 10,
      Number(offset) || 0,
    );
  }

  // ✅ Obtener más populares (por likes)
  @Get('populares')
  async obtenerPopulares(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.comentariosService.obtenerPopulares(
      Number(limit) || 10,
      Number(offset) || 0,
    );
  }
}
