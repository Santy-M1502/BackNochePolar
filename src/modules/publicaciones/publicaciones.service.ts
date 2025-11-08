import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Publicacion,
  PublicacionDocumento,
} from "../publicaciones/schema/publicaciones.schema";
import { Usuario } from "../usuarios/schema/usuarios.schema";

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<PublicacionDocumento>,
  ) {}

  async crearPublicacion(
    usuarioId: string,
    titulo: string,
    texto: string,
    imagenUrl?: string,
    cloudinaryPublicId?: string,
  ) {
    const nuevaPublicacion = new this.publicacionModel({
      usuario: new Types.ObjectId(usuarioId),
      titulo,
      texto,
      imagenUrl: imagenUrl || null,
      cloudinaryPublicId: cloudinaryPublicId || null,
    });
    return nuevaPublicacion.save();
  }

  async eliminarPublicacion(publicacionId: string, usuario: Usuario | any) {

    const publicacion = await this.publicacionModel.findById(publicacionId);
    if (!publicacion) throw new NotFoundException("Publicación no encontrada");

    const usuarioId = usuario._id?.toString() || usuario.sub?.toString();

    if (publicacion.usuario.toString() !== usuarioId && usuario.perfil !== "admin") {
      throw new ForbiddenException("No autorizado para eliminar esta publicación");
    }

    return this.publicacionModel.findByIdAndUpdate(
      publicacionId,
      { activa: false },
      { new: true },
    );
  }

  async actualizarPublicacion(
    publicacionId: string,
    usuario: Usuario | any,
    campos: Partial<Publicacion>,
  ) {
    const publicacion = await this.publicacionModel.findById(publicacionId);
    if (!publicacion) throw new NotFoundException("Publicación no encontrada");

    const usuarioId = usuario._id?.toString() || usuario.sub?.toString();

    if (publicacion.usuario.toString() !== usuarioId && usuario.perfil !== "admin") {
      throw new ForbiddenException("No autorizado para editar esta publicación");
    }

    return this.publicacionModel.findByIdAndUpdate(
      publicacionId,
      { $set: campos },
      { new: true },
    );
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

    // Filtrar por usuarioId
    if (usuarioId) {
      filtro.usuario = new Types.ObjectId(usuarioId);
    }

    if (username) {
      const usuario = await this.publicacionModel.db
        .collection("usuarios")
        .findOne({ username });
      if (usuario) filtro.usuario = usuario._id;
      else return [];
    }

    const sort: any =
      ordenarPor === "likes"
        ? { likesCount: -1, createdAt: -1 }
        : { createdAt: -1 };

    const publicaciones = await this.publicacionModel
      .find(filtro)
      .populate("usuario", "username nombre apellido profileImage")
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .exec();

    return publicaciones;
  }
  // GET /publicaciones?ordenarPor=likes
  // GET /publicaciones?usuarioId=672f3c1f8a1a2d7c1b3b4e5d
  // GET /publicaciones?username=juanperez
  // GET /publicaciones?offset=10&limit=5

  async obtenerInactivas(limit = 10, offset = 0) {
    console.log("📥 Buscando publicaciones inactivas...");
    const publicaciones = await this.publicacionModel
      .find({ activa: false })
      .sort({ updatedAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("usuario", "username nombre apellido profileImage");

    console.log(`✅ ${publicaciones.length} publicaciones inactivas encontradas`);
    return publicaciones;
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

  async toggleLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(publicacionId);
    if (!publicacion) throw new NotFoundException("Publicación no encontrada");

    if (!Array.isArray((publicacion as any).likes)) {
      (publicacion as any).likes = [];
    }

    const index = (publicacion as any).likes.findIndex(
      (id: Types.ObjectId) => id.toString() === usuarioId.toString(),
    );

    if (index > -1) {
      (publicacion as any).likes.splice(index, 1);
    } else {
      (publicacion as any).likes.push(new Types.ObjectId(usuarioId));
    }

    (publicacion as any).likesCount = (publicacion as any).likes.length;

    await publicacion.save();

    return {
      publicacionId,
      likesCount: (publicacion as any).likesCount,
      liked: index === -1,
    };
  }

  async darLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(publicacionId);
    if (!publicacion) throw new NotFoundException("Publicación no encontrada");

    const usuarioObjectId = new Types.ObjectId(usuarioId);

    if (publicacion.likes?.some((id: Types.ObjectId) => id.equals(usuarioObjectId))) {
      throw new ForbiddenException("Ya diste me gusta a esta publicación");
    }

    publicacion.likes.push(usuarioObjectId);
    publicacion.likesCount = publicacion.likes.length;
    await publicacion.save();

    return { message: "Like agregado", likes: publicacion.likesCount };
  }

  async quitarLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(publicacionId);
    if (!publicacion) throw new NotFoundException("Publicación no encontrada");

    const usuarioObjectId = new Types.ObjectId(usuarioId);

    if (!publicacion.likes?.some((id: Types.ObjectId) => id.equals(usuarioObjectId))) {
      throw new ForbiddenException("No habías dado like a esta publicación");
    }

    publicacion.likes = publicacion.likes.filter(
      (id: Types.ObjectId) => !id.equals(usuarioObjectId),
    );
    publicacion.likesCount = publicacion.likes.length;
    await publicacion.save();

    return { message: "Like eliminado", likes: publicacion.likesCount };
  }
}
