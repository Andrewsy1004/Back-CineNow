
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Auditorium, Movie, Seat, Sell } from '.';

@Entity('Funcion')
export class MovieScreening {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relaciones: Pelicula y Sala
  @ManyToOne(
    () => Movie,
    (Movie) => Movie.funcion,
    { eager: false }
  )
  @JoinColumn({ name: 'id_pelicula' })
  pelicula: Movie;

  @ManyToOne(
    () => Auditorium,
    (Auditorium) => Auditorium.funcion,
    { eager: false }
  )
  @JoinColumn({ name: 'id_sala' })
  sala: Auditorium;
  
   @OneToMany(
    () => Seat,
    (Seat) => Seat.salaF,
  )
  silla: Seat[];
  
   @OneToMany(
    () => Sell,
    (Sell) => Sell.Funcion,
  )
   Sell: Sell[];
   

  @Column('text')
  hora_inicio: string;

  @Column('text')
  hora_final: string;

  @Column('text')
  fecha: string;



}