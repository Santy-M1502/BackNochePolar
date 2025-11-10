import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../usuarios/schema/usuarios.schema';

export type PublicacionDocumento = HydratedDocument<Publicacion>;

@Schema({ timestamps: true })
export class Publicacion {
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuario: Types.ObjectId;

  @Prop({ type: String, required: true })
  titulo: string;

  @Prop({ type: String, required: true })
  texto: string;

  @Prop({ type: String, default: null })
  imagenUrl?: string;

  @Prop({ type: String, default: null })
  cloudinaryPublicId?: string;

  @Prop({ type: Boolean, default: true })
  activo: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: Usuario.name }] })
  likes: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comentario' }], default: [] })
  comentarios: Types.ObjectId[];
  
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
