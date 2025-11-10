import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like } from './schema/like.schema';
import { Guardado } from './schema/guardado.schema';
import { Publicacion } from '../publicaciones/schema/publicaciones.schema';

@Injectable()
export class InteraccionesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Guardado.name) private guardadoModel: Model<Guardado>,
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
  ) {}

  async toggleLike(usuarioId: string, publicacionId: string) {
    const existente = await this.likeModel.findOne({ usuario: usuarioId, publicacion: publicacionId });

    if (existente) {
      await existente.deleteOne();
      await this.publicacionModel.findByIdAndUpdate(publicacionId, { $inc: { likesCount: -1 } });
      return { liked: false };
    } else {
      await this.likeModel.create({ usuario: usuarioId, publicacion: publicacionId });
      await this.publicacionModel.findByIdAndUpdate(publicacionId, { $inc: { likesCount: 1 } });
      return { liked: true };
    }
  }

  async obtenerLikesDeUsuario(usuarioId: string) {
    const objectId = new Types.ObjectId(usuarioId);
    return this.publicacionModel
      .find({ likes: objectId })
      .populate('usuario', 'username profileImage')
      .exec();
  }

  async toggleGuardado(usuarioId: string, publicacionId: string) {
    const existente = await this.guardadoModel.findOne({ usuario: usuarioId, publicacion: publicacionId });

    if (existente) {
      await existente.deleteOne();
      return { guardado: false };
    } else {
      await this.guardadoModel.create({ usuario: usuarioId, publicacion: publicacionId });
      return { guardado: true };
    }
  }

  async obtenerGuardadas(usuarioId: string) {
    return this.guardadoModel.find({ usuario: usuarioId }).populate('publicacion');
  }
}
