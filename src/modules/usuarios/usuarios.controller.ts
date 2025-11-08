import {
  UseInterceptors, 
  UploadedFile, 
  Request, 
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Get } from '@nestjs/common';
import { AutenticacionGuard } from '../autenticacion/autenticacion.guard';
import { memoryStorage } from 'multer';


@Controller('usuarios') 
export class UsuariosController {
    constructor(private readonly usersService: UsuariosService) {}
//{url}/usuarios/register
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  async register(@Body() createUserDto: CreateUsuarioDto, @UploadedFile() avatar?: Express.Multer.File) {
    try {
      const user = await this.usersService.create(createUserDto, avatar);
      const userObj = user.toObject ? user.toObject() : user;
      const { claveHash, cloudinaryPublicId, ...result } = userObj;
      return result;
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e: any) => e.message);
        throw new BadRequestException({ message: 'Error de validación', details: messages });
      }
      if (err instanceof BadRequestException) throw err;
      console.error('Register error:', err);
      throw err;
    }
  }
//{url}/usuarios/upload-avatar
  @Post('upload-avatar')
  @UseGuards(AutenticacionGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ) {
    try {
      if (!file) {
        console.warn('No se recibió ningún archivo');
        throw new Error('No se recibió ningún archivo');
      }
      const userId = req.user.sub;

      const updatedUser = await this.usersService.updateProfileImage(userId, file);

      const { claveHash, ...result } = updatedUser.toObject();

      return result;
    } catch (err) {
      console.error('Error en upload-avatar:', err);
      throw err
    }
  }

  @Get('all')
  async getAll() {
    return this.usersService.getAll();
  }

  @Get()
  async all(){
    return this.usersService.all();
  }


}
