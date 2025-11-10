import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../usuarios/schema/usuarios.schema';
import { Publicacion } from '../../publicaciones/schema/publicaciones.schema';

export type GuardadoDocumento = HydratedDocument<Guardado>;

@Schema({ timestamps: true })
export class Guardado {
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Publicacion.name, required: true })
  publicacion: Types.ObjectId;
}

export const GuardadoSchema = SchemaFactory.createForClass(Guardado);
GuardadoSchema.index({ usuario: 1, publicacion: 1 }, { unique: true });
