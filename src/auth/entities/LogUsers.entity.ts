

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { user } from ".";

@Entity('LogUsuario')
export class LogUsers {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    

    // Relacion con Usuaio
    
    @ManyToOne(
        () => user,
        (user) => user.logs,
        { eager: false }
    )
    @JoinColumn({ name: 'id_usuario' })
    user: user;
    
    
    @Column('text')
    fecha: string;
        
    @Column('text')
    hora: string;

}