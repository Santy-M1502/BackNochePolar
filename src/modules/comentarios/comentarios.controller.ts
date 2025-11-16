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
  Patch,
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

  @UseGuards(AutenticacionGuard)
  @Post(':comentarioId/like')
  async darLike(@Param('comentarioId') comentarioId: string, @Req() req: Request) {
    const usuarioId = (req.user as any)?._id;
    if (!usuarioId) throw new UnauthorizedException('Usuario no autenticado');
    return this.comentariosService.darLike(comentarioId, usuarioId);
  }

  @UseGuards(AutenticacionGuard)
  @Delete(':comentarioId/like')
  async quitarLike(@Param('comentarioId') comentarioId: string, @Req() req: Request) {
    const usuarioId = (req.user as any)?._id;
    if (!usuarioId) throw new UnauthorizedException('Usuario no autenticado');
    return this.comentariosService.quitarLike(comentarioId, usuarioId);
  }

  // Endpoint principal para obtener comentarios de una publicación con paginación
  @Get('publicacion/:publicacionId')
  async obtenerPorPublicacion(
    @Param('publicacionId') publicacionId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('orden') orden?: 'recientes' | 'antiguos' | 'populares',
  ) {
    // Devuelve comentarios limitados por página. "offset" permite cargar más.
    return this.comentariosService.obtenerPorPublicacion(
      publicacionId,
      Number(limit) || 10, // por defecto 10 comentarios
      Number(offset) || 0,
      orden || 'recientes',
    );
  }

  // Endpoint para obtener respuestas de un comentario
  @Get(':comentarioId/respuestas')
  async obtenerRespuestas(
    @Param('comentarioId') comentarioId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.comentariosService.obtenerRespuestas(
      comentarioId,
      Number(limit) || 5, // por defecto 5 respuestas
      Number(offset) || 0,
    );
  }

  // Endpoint para cargar comentarios de un usuario
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

  // Últimos comentarios de todas las publicaciones
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

  // Comentarios más populares
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

  @UseGuards(AutenticacionGuard)
  @Patch(':comentarioId')
  async editarComentario(
    @Param('comentarioId') comentarioId: string,
    @Body() body: { texto: string },
    @Req() req: Request,
  ) {
    const usuarioId = (req.user as any)?._id;
    if (!usuarioId) throw new UnauthorizedException('Usuario no autenticado');

    return this.comentariosService.editarComentario(comentarioId, usuarioId, body.texto);
  }
}
