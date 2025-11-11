import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UsuarioDocumento = HydratedDocument<Usuario>;

@Schema({ timestamps: true })
export class Usuario {

  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  claveHash: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ default: 'usuario' })
  perfil: string;

  @Prop({ default: null })
  descripcion?: string;

  @Prop({ default: 'https://res.cloudinary.com/dzwlpr7ay/image/upload/v1762178755/avatar-anon_vmiwkv.png' })
  profileImage?: string;

  @Prop({ default: 'https://res.cloudinary.com/dzwlpr7ay/image/upload/v1762178571/default-avatar_n9xfbe.avif' })
  profileCover?: string;

  @Prop({ default: null })
  cloudinaryPublicId?: string;

  // ✅ NUEVO: Lista de amigos
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
  amigos: Types.ObjectId[];
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
