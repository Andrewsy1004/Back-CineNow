
import { IsString } from "class-validator";

export class createSeatMoviesDto {
    @IsString({ each: true })
    posicion: string[];

    @IsString()
    hora_inicio: string;

    @IsString()
    hora_final: string;

    @IsString()
    fecha: string;

    @IsString()
    id_pelicula: string;

    @IsString()
    total: string;

    @IsString()
    metodo_pago: string;

}

