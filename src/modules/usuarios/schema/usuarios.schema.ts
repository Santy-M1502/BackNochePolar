import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UsuarioDocumento = HydratedDocument<Usuario>;

@Schema({timestamps: true})
export class Usuario{

    @Prop({
        required: true,
        unique: true,
        index: true
    })
    username: string;

    @Prop({
        required: true
    })
    claveHash: string;

    @Prop({
        required: true,
    })
    nombre: string;

    @Prop({
        required: true,
    })
    apellido: string;

    @Prop({
        required: true,
    })
    email: string;

    @Prop({
        required: true,
    })
    fecha: Date

    @Prop({ default: null})
    descripcion?: string

    @Prop({ default: null })
    profileImage?: string;

    @Prop({ default: null })
    cloudinaryPublicId?: string;

}
export const UsuarioSchema = SchemaFactory.createForClass(Usuario)