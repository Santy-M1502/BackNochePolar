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
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AutenticacionGuard } from '../autenticacion/autenticacion.guard';


@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usersService: UsuariosService) {}

  @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUsuarioDto) {
      console.log('Register body recibido:', createUserDto);
      try {
        const user = await this.usersService.create(createUserDto);
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

  @Post('upload-avatar')
  @UseGuards(AutenticacionGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /\/(jpg|jpeg|png|gif)$/ }),
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
      throw err; // para que NestJS lo capture y devuelva un error HTTP
    }
  }

}
