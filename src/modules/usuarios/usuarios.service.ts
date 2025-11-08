import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioDocumento } from './schema/usuarios.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectModel(Usuario.name) private UsuarioModel: Model<UsuarioDocumento>,
            private cloudinaryService: CloudinaryService
    ){}

    async findByUsername(username: string): Promise<UsuarioDocumento | null> {
        return this.UsuarioModel.findOne({ username : username }).exec()
    }

    async findByEmail(email: string): Promise<UsuarioDocumento | null> {
        return this.UsuarioModel.findOne({ email : email }).exec()
    }

    async findById(id: string): Promise<UsuarioDocumento | null> {
        return this.UsuarioModel.findById(id).exec();
    }

    async getAll(){
        return this.UsuarioModel.find({}, { email: 1, username: 1, _id: 0 }).exec()
    }

    async all(){
        return this.UsuarioModel.find({}).exec()
    }

    async findByEmailOrUsername(identifier: string): Promise<UsuarioDocumento | null> {
        return this.UsuarioModel.findOne({
        $or: [{ username: identifier }, { email: identifier }]
        }).exec();
    }

    async create(createUsuarioDto: CreateUsuarioDto, file?: Express.Multer.File): Promise<UsuarioDocumento> {

    const existingUserMail = await this.findByEmail(createUsuarioDto.email);
    if (existingUserMail) {
        throw new BadRequestException('El email ya está registrado');
}

    const existingUsername = await this.findByUsername(createUsuarioDto.username);
    if (existingUsername) {
        throw new BadRequestException('El username ya está registrado');
    }

    const required = ['nombre', 'apellido', 'username', 'email', 'password', 'fecha'];
    const missing = required.filter((k) => !(createUsuarioDto as any)[k]);
    if (missing.length > 0) {
        throw new BadRequestException(`Faltan campos requeridos: ${missing.join(', ')}`);
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUsuarioDto.password, saltRounds);

        const userObj: Partial<Usuario> = {
        nombre: createUsuarioDto.nombre,
        apellido: createUsuarioDto.apellido,
        username: createUsuarioDto.username,
        email: createUsuarioDto.email,
        claveHash: hashedPassword,
        fecha: new Date(createUsuarioDto.fecha),
        descripcion: createUsuarioDto.descripcion ?? '',
        };

        if (file) {
        try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        userObj.profileImage = uploadResult.secure_url;
        userObj.cloudinaryPublicId = uploadResult.public_id;
        } catch (e) {
            console.error('Error subiendo avatar a Cloudinary:', e);
            throw new InternalServerErrorException('Error subiendo la imagen');
        }
        }

        const createdUser = new this.UsuarioModel(userObj);
        return await createdUser.save();
    } catch (err: any) {
        if (err.name === 'ValidationError') {
        throw err;
        }
        console.error('Error creando usuario:', err);
        throw new InternalServerErrorException('No se pudo crear el usuario');
    }
    }

    async updateProfileImage(
        userId: string,
        file: Express.Multer.File,
    ): Promise<UsuarioDocumento> {
        const user = await this.findById(userId);
        if (!user) {
        throw new Error('Usuario no encontrado');
        }

        if (user.cloudinaryPublicId) {
        await this.cloudinaryService.deleteImage(user.cloudinaryPublicId);
        }

        const uploadResult = await this.cloudinaryService.uploadImage(file);
        
        user.profileImage = uploadResult.secure_url;
        user.cloudinaryPublicId = uploadResult.public_id;
        
        return user.save();
    }
}
