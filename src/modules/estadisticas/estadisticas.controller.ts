import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { AdminGuard } from '../common/guards/roles.guard';

@Controller('estadisticas')
@UseGuards(AdminGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  async publicacionesPorUsuario(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.estadisticasService.publicacionesPorUsuario(desde, hasta);
  }

  @Get('comentarios')
  async comentariosEnLapso(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.estadisticasService.comentariosEnLapso(desde, hasta);
  }

  @Get('comentarios-por-publicacion')
  async comentariosPorPublicacion(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.estadisticasService.comentariosPorPublicacion(desde, hasta);
  }
}
