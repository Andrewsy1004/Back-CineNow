

import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @MinLength(4)
    nombre: string;
    
    @IsString()
    @MinLength(4)
    apellido: string;
    
    @IsString()
    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
        message: 'El correo debe ser de gmail',
      })
    correo: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número o un caracter especial',
    })
    contrasena: string;

    @IsOptional()
    @IsString()
    FotoPerfil?: string;

    @IsOptional()
    @IsString()
    roles: string[];

    @IsOptional()
    @IsString()
    NumeroCuenta: string;
     
}