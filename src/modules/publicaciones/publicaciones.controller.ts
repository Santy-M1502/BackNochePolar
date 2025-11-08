import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { PublicacionesService } from "./publicaciones.service";
import type { Request } from "express";
import { AutenticacionGuard } from "../autenticacion/autenticacion.guard";
import { CreatePublicacionDto } from './dto/create-publicacion.dto';

@Controller("publicaciones")
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

    @UseGuards(AutenticacionGuard)
    @Post()
    async crearPublicacion(
    @Body() body: CreatePublicacionDto,
    @Req() req: Request,
    ) {
    if (!req.user?._id) {
        throw new UnauthorizedException('Usuario no autenticado');
    }

    const usuarioId = req.user._id.toString();
    return this.publicacionesService.crearPublicacion(
        usuarioId,
        body.texto,
        body.imagenUrl,
    );
    }

  @UseGuards(AutenticacionGuard)
  @Delete(":id")
  async eliminarPublicacion(@Param("id") id: string, @Req() req: Request) {
    const usuario = req.user;
    return this.publicacionesService.eliminarPublicacion(id, usuario as any);
  }

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

  @Get("ultimas")
  async ultimas(@Query("limit") limit?: number) {
    return this.publicacionesService.obtenerUltimas(Number(limit) || 5);
  }

  @Get("antiguas")
  async antiguas(@Query("limit") limit?: number) {
    return this.publicacionesService.obtenerMasAntiguas(Number(limit) || 5);
  }

  @Get("con-imagen")
  async conImagen(@Query("limit") limit?: number) {
    return this.publicacionesService.obtenerConImagen(Number(limit) || 10);
  }
}
