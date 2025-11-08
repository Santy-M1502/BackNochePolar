import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Publicacion, PublicacionDocumento } from "../publicaciones/schema/publicaciones.schema";
import { Usuario } from "../usuarios/schema/usuarios.schema";

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<PublicacionDocumento>,
  ) {}

  async crearPublicacion(usuarioId: string, texto: string, imagenUrl?: string) {
    const nuevaPublicacion = new this.publicacionModel({
      usuario: new Types.ObjectId(usuarioId),
      texto,
      imagenUrl: imagenUrl || null,
    });
    return nuevaPublicacion.save();
  }

  async eliminarPublicacion(publicacionId: string, usuario: Usuario) {
    const publicacion = await this.publicacionModel.findById(publicacionId);

    if (!publicacion) throw new NotFoundException("Publicación no encontrada");

    if (
      publicacion.usuario.toString() !== usuario._id.toString() &&
      usuario.perfil !== "admin"
    ) {
      throw new ForbiddenException("No autorizado para eliminar esta publicación");
    }

    return this.publicacionModel.findByIdAndUpdate(publicacionId, { activa: false }, { new: true });
  }

  async obtenerPublicaciones({
    usuarioId,
    username,
    ordenarPor = "fecha",
    limit = 10,
    offset = 0,
    soloConImagen = false,
  }: {
    usuarioId?: string;
    username?: string;
    ordenarPor?: "fecha" | "likes";
    limit?: number;
    offset?: number;
    soloConImagen?: boolean;
  }) {
    const filtro: any = { activa: { $ne: false } };

    if (usuarioId) filtro.usuario = new Types.ObjectId(usuarioId);
    if (soloConImagen) filtro.imagenUrl = { $ne: null };

    let sort: any = {};

    if (ordenarPor === 'likes') {
    sort = { likesCount: -1, createdAt: -1 };
    } else {
    sort = { createdAt: -1 };

    const query = this.publicacionModel
      .find(filtro)
      .populate("usuario", "username nombre apellido profileImage")
      .sort(sort)
      .skip(offset)
      .limit(limit);

    return query.exec();
  }
}

  async obtenerUltimas(limit = 5) {
    return this.publicacionModel
      .find({ activa: { $ne: false } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("usuario", "username profileImage");
  }

  async obtenerMasAntiguas(limit = 5) {
    return this.publicacionModel
      .find({ activa: { $ne: false } })
      .sort({ createdAt: 1 })
      .limit(limit)
      .populate("usuario", "username profileImage");
  }

  async obtenerConImagen(limit = 10) {
    return this.publicacionModel
      .find({ imagenUrl: { $ne: null }, activa: { $ne: false } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("usuario", "username profileImage");
  }
}
