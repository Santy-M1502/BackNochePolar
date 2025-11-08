import { IsOptional, IsString } from 'class-validator';

export class CreatePublicacionDto {
  @IsString()
  titulo: string;

  @IsString()
  texto: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @IsOptional()
  @IsString()
  cloudinaryPublicId?: string;
}
