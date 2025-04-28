
import { IsString } from "class-validator";

export class GetSeatMoviesDto {
   
    @IsString()
    fecha: string;

    @IsString()
    hora_inicio: string;


    @IsString()
    hora_final: string;


    @IsString()
    peliculaId: string;
   
}

