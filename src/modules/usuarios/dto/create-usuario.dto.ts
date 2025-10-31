import { IsNotEmpty, IsString, MinLength, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty() @IsString() nombre: string;

  @IsNotEmpty() @IsString() apellido: string;

  @IsNotEmpty() @IsString() username: string;

  @IsNotEmpty() @IsEmail() email: string;

  @IsNotEmpty() @IsString() @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty() @IsDateString() fecha: string;

  @IsOptional() @IsString() descripcion?: string;
}
