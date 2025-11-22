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

    const cantidad = await this.comentarioModel.countDocuments({
      createdAt: { $gte: inicio, $lte: fin },
    });

    return { cantidad };
  }

  async comentariosPorPublicacion(fechaInicio: string, fechaFin: string) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const resultado = await this.comentarioModel.aggregate([
      { $match: { createdAt: { $gte: inicio, $lte: fin } } },
      { $group: { _id: "$publicacion", cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "publicacions",
          localField: "_id",
          foreignField: "_id",
          as: "publicacion",
        },
      },
      { $unwind: "$publicacion" },
      {
        $project: {
          _id: 0,
          publicacionId: "$publicacion._id",
          titulo: "$publicacion.titulo",
          cantidad: 1,
        },
      },
    ]);

    return resultado;
  }
}
