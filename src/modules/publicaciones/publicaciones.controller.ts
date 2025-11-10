import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
  InternalServerErrorException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PublicacionesService } from "./publicaciones.service";
import type { Request } from "express";
import { AutenticacionGuard } from "../autenticacion/autenticacion.guard";
import { CreatePublicacionDto } from "./dto/create-publicacion.dto";
import { UpdatePublicacionDto } from "./dto/update-publicacion.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Controller("publicaciones")
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Crear publicación
  @UseGuards(AutenticacionGuard)
  @Post()
  @UseInterceptors(FileInterceptor("imagen"))
  async crearPublicacion(
    @Body() body: CreatePublicacionDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const user: any = req.user;
    const usuarioId = user._id;
    if (!usuarioId) throw new UnauthorizedException("Usuario no autenticado");

    let imagenUrl = null;
    let cloudinaryPublicId = null;

    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadPublicacionImage(file);
        imagenUrl = uploadResult.secure_url;
        cloudinaryPublicId = uploadResult.public_id;
      } catch (e) {
        console.error("❌ Error subiendo imagen de publicación:", e);
        throw new InternalServerErrorException("Error subiendo la imagen");
      }
    }

    return this.publicacionesService.crearPublicacion(
      usuarioId,
      body.titulo,
      body.texto,
      imagenUrl || undefined,
      cloudinaryPublicId || undefined,
    );
  }

  // Eliminar publicación
  @UseGuards(AutenticacionGuard)
  @Delete(":id")
  async eliminarPublicacion(@Param("id") id: string, @Req() req: Request) {
    return this.publicacionesService.eliminarPublicacion(id, req.user as any);
  }

  // Actualizar publicación
  @UseGuards(AutenticacionGuard)
  @Patch(":id")
  async actualizarPublicacion(
    @Param("id") id: string,
    @Body() body: UpdatePublicacionDto,
    @Req() req: Request,
  ) {
    return this.publicacionesService.actualizarPublicacion(id, req.user as any, body);
  }

  // Obtener publicaciones con filtros generales
  @Get()
  async obtenerPublicaciones(
    @Query("usuarioId") usuarioId?: string,
    @Query("username") username?: string,
    @Query("ordenarPor") ordenarPor?: "fecha" | "likes",
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
    @Query("soloConImagen") soloConImagen?: boolean,
  ) {
    return this.publicacionesService.obtenerPublicaciones({
      usuarioId,
      username,
      ordenarPor,
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
      soloConImagen: soloConImagen === true,
    });
  }

  @Get('ultimas')
  async obtenerUltimas(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('usuarioId') usuarioId?: string,
  ) {
    return this.publicacionesService.obtenerUltimas(
      Number(limit) || 5,
      Number(offset) || 0,
      usuarioId,
    );
  }

  @Get('antiguas')
  async obtenerMasAntiguas(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('usuarioId') usuarioId?: string,
  ) {
    return this.publicacionesService.obtenerMasAntiguas(
      Number(limit) || 5,
      Number(offset) || 0,
      usuarioId,
    );
  }

  // Publicaciones activas
  @Get("activas")
  async activas(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number
  ) {
    return this.publicacionesService.obtenerActivas(Number(limit) || 10, Number(offset) || 0);
  }

  // Publicaciones inactivas
  @Get("inactivas")
  async inactivas(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number
  ) {
    return this.publicacionesService.obtenerInactivas(Number(limit) || 10, Number(offset) || 0);
  }

  // Publicaciones con imagen
  @Get("con-imagen")
  async conImagen(@Query("limit") limit?: number) {
    return this.publicacionesService.obtenerConImagen(Number(limit) || 10);
  }

  // Búsqueda por título o texto
  @Get("buscar")
  async buscar(
    @Query("q") query: string,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number
  ) {
    return this.publicacionesService.buscarPublicaciones(query, Number(limit) || 10, Number(offset) || 0);
  }

  // Likes
  @UseGuards(AutenticacionGuard)
  @Post(':id/like')
  async darLike(@Param('id') publicacionId: string, @Req() req: any) {
    const usuarioId = req.user?._id;
    if (!usuarioId) throw new UnauthorizedException('Usuario no autenticado');
    return this.publicacionesService.darLike(publicacionId, usuarioId);
  }

  @UseGuards(AutenticacionGuard)
  @Delete(':id/like')
  async quitarLike(@Param('id') publicacionId: string, @Req() req: any) {
    const usuarioId = req.user?._id;
    if (!usuarioId) throw new UnauthorizedException('Usuario no autenticado');
    return this.publicacionesService.quitarLike(publicacionId, usuarioId);
  }
  
  // ✅ Obtener por usuario
  @Get('usuario/:usuarioId')
  async obtenerPorUsuario(
    @Param('usuarioId') usuarioId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.publicacionesService.obtenerPorUsuario(usuarioId, Number(limit) || 10, Number(offset) || 0);
  }

  // ✅ Últimas del usuario
  @Get('usuario/:usuarioId/ultimas')
  async obtenerUltimasPorUsuario(
    @Param('usuarioId') usuarioId: string,
    @Query('limit') limit?: string
  ) {
    return this.publicacionesService.obtenerUltimasPorUsuario(usuarioId, Number(limit) || 5);
  }

  // ✅ Más antiguas del usuario
  @Get('usuario/:usuarioId/antiguas')
  async obtenerAntiguasPorUsuario(
    @Param('usuarioId') usuarioId: string,
    @Query('limit') limit?: string
  ) {
    return this.publicacionesService.obtenerAntiguasPorUsuario(usuarioId, Number(limit) || 5);
  }

  // ✅ Activas del usuario
  @Get('usuario/:usuarioId/activas')
  async obtenerActivasPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.publicacionesService.obtenerActivasPorUsuario(usuarioId);
  }

  // ✅ Inactivas del usuario
  @Get('usuario/:usuarioId/inactivas')
  async obtenerInactivasPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.publicacionesService.obtenerInactivasPorUsuario(usuarioId);
  }
}
