import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../usuarios/schema/usuarios.schema';
import { Publicacion } from '../../publicaciones/schema/publicaciones.schema';

export type ComentarioDocumento = HydratedDocument<Comentario>;

@Schema({ timestamps: true })
export class Comentario {
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Publicacion.name, required: true })
  publicacion: Types.ObjectId;

  @Prop({ type: String, required: true })
  texto: string;

  @Prop({ type: Types.ObjectId, ref: 'Comentario', default: null })
  comentarioPadre?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comentario' }], default: [] })
  respuestas: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Usuario.name }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  likesCount: number;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
