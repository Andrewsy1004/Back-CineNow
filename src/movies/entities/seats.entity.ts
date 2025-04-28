

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auditorium, MovieScreening } from ".";

@Entity('Silla')
export class Seat {

   @PrimaryGeneratedColumn('uuid')
   id: string;

   // Relaciones: Pelicula y Sala
   
   @ManyToOne(
       () => Auditorium,
       (Auditorium) => Auditorium.silla,
       { eager: false }
     )
    @JoinColumn({ name: 'id_sala' })
    sala: Auditorium; 
    
    @ManyToOne(
        () => MovieScreening,
        (MovieScreening) => MovieScreening.silla,
        { eager: false }
      )
    @JoinColumn({ name: 'id_funcion' })
    salaF: MovieScreening; 
 


   @Column('text')
   posicion: string;
   

}