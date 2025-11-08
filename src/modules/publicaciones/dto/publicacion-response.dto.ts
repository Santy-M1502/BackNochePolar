import { Expose, Type } from 'class-transformer';

export class PublicacionResponseDto {
  @Expose()
  id: string;

  @Expose()
  texto: string;

  @Expose()
  imagenUrl?: string;

  @Expose()
  activa: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UsuarioMiniDto)
  usuario: UsuarioMiniDto;
}

export class UsuarioMiniDto {
  @Expose()
  id: string;

  @Expose()
  nombre: string;

  @Expose()
  email: string;
}
