import { IsNotEmpty, IsString, MinLength, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class LoginDto {

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
