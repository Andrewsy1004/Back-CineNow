import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { user } from "src/auth/entities";
import { MovieScreening } from "./Moviescreening.entity";

@Entity('Pelicula')
export class Movie {
  @PrimaryColumn('text')
  id: string;

  // Relación con el id de la tabla de usuario
  @ManyToOne(
    () => user,
    (user) => user.pelicula,
    { eager: false }
  )
  usuario: user;

  @OneToMany(
    () => MovieScreening,
    (MovieScreening) => MovieScreening.pelicula,
  )
  funcion: MovieScreening[];

  @Column('text')
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column('text')
  Poster: string;

  @Column('text', {
    array: true,
    default: []
  })
  generos: string[];

  @Column('text')
  promedio: string;

  @Column('text')
  fecha_lanzamiento: string;
}