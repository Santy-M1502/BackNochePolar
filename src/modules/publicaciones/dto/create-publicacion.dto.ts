import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreatePublicacionDto {
  @IsNotEmpty()
  @IsString()
  texto: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
