

import { Movie, Sell } from "src/movies/entities";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LogUsers } from ".";


@Entity('Usuario')
export class user {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;
    
    @Column('text')
    apellido: string;

    @Column('text', {
        unique: true
    })
    correo: string;
    
    @Column('text')
    contrasena: string;
    
    @Column('text', {
        array: true,
        default: ['usuario']
    })
    roles: string[];

    @Column('text',{
        nullable: true
    })
    FotoPerfil: string; 

    @Column('bool', {
        default: true
    })
    activo: boolean;
    
    @Column('text',{
        nullable: true
    })
    NumeroCuenta: string; 
   
    // Relaciones

    @OneToMany(
        () => Movie,
        ( Movie ) => Movie.usuario
    )
    pelicula: Movie;


    @OneToMany(
        () => Sell,
        ( Sell ) => Sell.user
    )
    Sell: Sell;


     @OneToMany(
        () => LogUsers,
        ( LogUsers ) => LogUsers.user
    )
    logs: LogUsers;

}