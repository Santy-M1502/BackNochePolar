import { IsString, IsOptional } from "class-validator";

export class UpdatePublicacionDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  texto?: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
