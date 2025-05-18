

import { user } from "src/auth/entities";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MovieScreening } from ".";


@Entity('Venta')
export class Sell {

   @PrimaryGeneratedColumn('uuid')
   id: string;
   
   // Relaciones: Usuario y Funcion 
   
   @ManyToOne(
       () => user,
       (user) => user.Sell,
       { eager: false }
     )
    @JoinColumn({ name: 'id_usuario' })
    user: user;
    
    @ManyToOne(
      () => MovieScreening,
      (MovieScreening) => MovieScreening.Sell,
      { eager: false }
    )
    @JoinColumn({ name: 'id_funcion' })
    Funcion: MovieScreening;

   @Column('text')
   fecha: string;
   
   @Column('text')
   total: string;
   
   @Column('text')
   metodo_pago: string;
    
   @Column('text', {
     array: true,
     default: []
   })
   numero_asientos: string[];
   

}