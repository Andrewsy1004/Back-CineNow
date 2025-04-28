
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MovieScreening, Seat } from '.';

@Entity('Sala')
export class Auditorium {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('text')
  capacidad: string;

  @Column('boolean', { default: false })
  estado: boolean;

  @OneToMany(
    () => MovieScreening,
    (MovieScreening) => MovieScreening.sala,
  )
  funcion: MovieScreening[];
  
  
  @OneToMany(
    () => Seat,
    (Seat) => Seat.sala,
  )
  silla: Seat[];


}