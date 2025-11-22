import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import {
  Publicacion,
  PublicacionDocumento,
} from "../publicaciones/schema/publicaciones.schema";

import { Comentario, ComentarioDocumento } from "../comentarios/schema/comentario.schema";

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocumento>,

    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<ComentarioDocumento>,
  ) {}

  async publicacionesPorUsuario(fechaInicio: string, fechaFin: string) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const resultado = await this.publicacionModel.aggregate([
      { $match: { createdAt: { $gte: inicio, $lte: fin } } },
      { $group: { _id: "$usuario", cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } },
      { $limit: 5 },          
      {
        $lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "_id",
          as: "usuario",
        },
      },
      { $unwind: "$usuario" },
      {
        $project: {
          _id: 0,
          usuarioId: "$usuario._id",
          username: "$usuario.username",
          cantidad: 1,
        },
      },
    ]);

    return resultado;
  }


  async comentariosEnLapso(fechaInicio: string, fechaFin: string) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    // Calcular duración total y dividir en 3 intervalos
    const totalMs = fin.getTime() - inicio.getTime();
    const intervaloMs = totalMs / 3;

    const periodos = [
      { desde: new Date(inicio.getTime()), hasta: new Date(inicio.getTime() + intervaloMs) },
      { desde: new Date(inicio.getTime() + intervaloMs + 1), hasta: new Date(inicio.getTime() + 2 * intervaloMs) },
      { desde: new Date(inicio.getTime() + 2 * intervaloMs + 1), hasta: fin },
    ];

    // Contar comentarios en cada periodo
    const resultados = await Promise.all(
      periodos.map(async p => {
        const count = await this.comentarioModel.countDocuments({
          createdAt: { $gte: p.desde, $lte: p.hasta }
        });
        return { desde: p.desde, hasta: p.hasta, count };
      })
    );

    return resultados;
  }

 async comentariosPorPublicacion(fechaInicio: string, fechaFin: string) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  fin.setHours(23, 59, 59, 999);

  const resultado = await this.comentarioModel.aggregate([
    // Filtrar por rango de fechas
    {
      $match: {
        createdAt: { $gte: inicio, $lte: fin }
      }
    },
    // Agrupar por ID de publicación
    {
      $group: {
        _id: '$publicacion',
        cantidadComentarios: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Mapear para devolver un objeto más amigable
  return resultado.map(r => ({
    publicacionId: r._id,
    cantidad: r.cantidadComentarios
  }));
}
}
