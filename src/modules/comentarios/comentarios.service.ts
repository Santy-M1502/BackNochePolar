import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comentario, ComentarioDocumento } from './schema/comentario.schema';
import { Publicacion, PublicacionDocumento } from '../publicaciones/schema/publicaciones.schema';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name) private comentarioModel: Model<ComentarioDocumento>,
    @InjectModel(Publicacion.name) private publicacionModel: Model<PublicacionDocumento>,
  ) {}

  async comentarPublicacion(usuarioId: string, publicacionId: string, texto: string) {
    const publicacion = await this.publicacionModel.findById(publicacionId);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    const comentario = await this.comentarioModel.create({
      usuario: usuarioId,
      publicacion: publicacionId,
      texto,
    });

    await this.publicacionModel.findByIdAndUpdate(publicacionId, {
      $push: { comentarios: comentario._id },
    });

    return comentario.populate('usuario', 'username profileImage');
  }

  async responderComentario(usuarioId: string, comentarioPadreId: string, texto: string) {
    const padre = await this.comentarioModel.findById(comentarioPadreId);
    if (!padre) throw new NotFoundException('Comentario padre no encontrado');

    const respuesta = await this.comentarioModel.create({
      usuario: usuarioId,
      publicacion: padre.publicacion,
      texto,
      comentarioPadre: padre._id,
    });

    await this.comentarioModel.findByIdAndUpdate(padre._id, {
      $push: { respuestas: respuesta._id },
    });

    return respuesta.populate('usuario', 'username profileImage');
  }

  async darLike(comentarioId: string, usuarioId: string) {
    const comentario = await this.comentarioModel.findById(comentarioId);
    if (!comentario) throw new NotFoundException('Comentario no encontrado');

    if (comentario.likes.includes(new Types.ObjectId(usuarioId))) {
      throw new BadRequestException('Ya diste like a este comentario');
    }

    comentario.likes.push(new Types.ObjectId(usuarioId));
    comentario.likesCount = comentario.likes.length;
    await comentario.save();

    return comentario.populate('usuario', 'username profileImage');
  }

  async quitarLike(comentarioId: string, usuarioId: string) {
    const comentario = await this.comentarioModel.findById(comentarioId);
    if (!comentario) throw new NotFoundException('Comentario no encontrado');

    const index = comentario.likes.findIndex(
      (id) => id.toString() === usuarioId.toString(),
    );
    if (index === -1) throw new BadRequestException('No habías dado like');

    comentario.likes.splice(index, 1);
    comentario.likesCount = comentario.likes.length;
    await comentario.save();

    return comentario.populate('usuario', 'username profileImage');
  }

  async obtenerPorPublicacion(
    publicacionId: string,
    limit: number,
    offset: number,
    orden: 'recientes' | 'antiguos' | 'populares',
  ) {
    let sortOptions: Record<string, 1 | -1> =
      orden === 'antiguos' ? { createdAt: 1 } :
      orden === 'populares' ? { likesCount: -1 } :
      { createdAt: -1 };

    const [total, comentarios] = await Promise.all([
      this.comentarioModel.countDocuments({ publicacion: publicacionId, comentarioPadre: null }),
      this.comentarioModel
        .find({ publicacion: publicacionId, comentarioPadre: null })
        .sort(sortOptions)
        .skip(offset)
        .limit(limit)
        .populate('usuario', 'username profileImage')
        .populate({
          path: 'respuestas',
          populate: { path: 'usuario', select: 'username profileImage' },
          options: { sort: { createdAt: -1 } as Record<string, 1 | -1>, limit: 3 }, // primeras 3 respuestas
        }),
    ]);

    return { total, comentarios };
  }

  async obtenerRespuestas(comentarioId: string, limit: number, offset: number, orden: 'recientes' | 'antiguos' = 'recientes') {
    const sort: Record<string, 1 | -1> = orden === 'antiguos' ? { createdAt: 1 } : { createdAt: -1 };
    const [total, respuestas] = await Promise.all([
      this.comentarioModel.countDocuments({ comentarioPadre: comentarioId }),
      this.comentarioModel
        .find({ comentarioPadre: comentarioId })
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .populate('usuario', 'username profileImage'),
    ]);

    return { total, respuestas };
  }

  async obtenerPorUsuario(usuarioId: string, limit: number, offset: number) {
    const [total, comentarios] = await Promise.all([
      this.comentarioModel.countDocuments({ usuario: usuarioId }),
      this.comentarioModel
        .find({ usuario: usuarioId })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate('usuario', 'username profileImage')
        .populate('publicacion', 'titulo texto'),
    ]);

    return { total, comentarios };
  }

  async obtenerUltimos(limit: number, offset: number) {
    const [total, comentarios] = await Promise.all([
      this.comentarioModel.countDocuments(),
      this.comentarioModel
        .find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate('usuario', 'username profileImage')
        .populate('publicacion', 'titulo texto'),
    ]);

    return { total, comentarios };
  }

  async obtenerPopulares(limit: number, offset: number) {
    const [total, comentarios] = await Promise.all([
      this.comentarioModel.countDocuments(),
      this.comentarioModel
        .find()
        .sort({ likesCount: -1, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate('usuario', 'username profileImage')
        .populate('publicacion', 'titulo texto'),
    ]);

    return { total, comentarios };
  }

  async editarComentario(comentarioId: string, usuarioId: string, nuevoTexto: string) {
    const comentario = await this.comentarioModel.findById(comentarioId);
    if (!comentario) throw new NotFoundException('Comentario no encontrado');

    if (comentario.usuario.toString() !== usuarioId.toString()) {
      throw new UnauthorizedException('No puedes editar este comentario');
    }

    comentario.texto = nuevoTexto;
    comentario.editado = true;
    await comentario.save();

    return comentario.populate('usuario', 'username profileImage');
  }
}
