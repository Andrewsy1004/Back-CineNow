

import { Injectable, Logger, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { user } from 'src/auth/entities';
import { Auditorium, Movie, MovieScreening, Seat } from './entities';

import { AuthService } from 'src/auth/auth.service';
import { GetSeatMoviesDto } from './dto';

@Injectable()
export class MoviesService {
  
  private readonly logger = new Logger('MoviesService');
  

  constructor(
    @InjectRepository(user)
    private readonly userRepository: Repository<user>,
    
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Auditorium)
    private readonly salaRepository: Repository<Auditorium>,

    @InjectRepository(MovieScreening)
    private readonly funcionRepository: Repository<MovieScreening>,

    @InjectRepository(Seat)
    private readonly SeatRepository: Repository<Seat>,

    private readonly authService: AuthService
  ) {}

   
  async getMoviesSeats( getSeatMoviesDto: GetSeatMoviesDto ){
    try {
      
      console.log('getSeatMoviesDto', getSeatMoviesDto);

      // const NumeroCuenta = "123 456 789";
      const fecha = "2025-04-28";

      const hora = "10:00 - 12:00";
      const hora_inicio = "13";
      const hora_final = "15";
     
      const peliculaId = "1020414";


      // VERIFICAR SI EXISTE O NO UNA FUNCION EN ESE DIA CON ESAS PELICULAS A ESAS HORAS 

      const existingScreening = await this.funcionRepository.findOne({
        where: {
          pelicula: { id: peliculaId },
          fecha,
          hora_inicio,
          hora_final,
        },
        relations: ['pelicula', 'sala'],
      });
      
      // SI NO EXISTE, VERIFICAR SI ESTA PREVIAMENTE ASOCIADA LA PELICULA A UNA SALA, NO IMPORTA EL HORARIO 
      if (!existingScreening) {
        
        const existingScreeningWithSala = await this.funcionRepository.findOne({
          where: {
            pelicula: { id: peliculaId },
          },
          relations: ['pelicula', 'sala'],
        });
 
        // SI NO EXISTE UNA FUNCION CON ESA PELICULA
        if( !existingScreeningWithSala){
          
           // Bucsar una sala disponible
          const availableSala = await this.salaRepository.findOne({
            where: {
             estado: false ,
            },
          });
          
          // cambiar estado de la sala a true
          if (availableSala) {
            availableSala.estado = true;
            await this.salaRepository.save(availableSala);
          } 

          // Crear una nueva funcion
          const newScreening = this.funcionRepository.create({
            pelicula: { id: peliculaId },
            fecha,
            hora_inicio,
            hora_final,
            sala: { id: availableSala.id },
          });

          await this.funcionRepository.save(newScreening);

          return {
            msg: "funcion creada a partir de una nueva sala disponible",
            asientos: [""]
          };
          

        }
        

        // Crear una nueva funcion
        const newScreening = this.funcionRepository.create({
          pelicula: { id: peliculaId },
          fecha,
          hora_inicio,
          hora_final,
          sala: { id: existingScreeningWithSala.sala.id },
        });

        await this.funcionRepository.save(newScreening);

        return {
          msg: "funcion creada a partir de la sala existente",
          asientos: [""]
        };

      }
       

      //TODO: RECUPERAR LOS ASIENTOS DE LA FUNCION EXISTENTE

      // console.log('id_sala', existingScreening.sala.id);
      // console.log('id_funcion', existingScreening.pelicula);


      // Consultar id de la Funcion

      const funcion = await this.funcionRepository.findOne({
        where: {
          pelicula: { id: existingScreening.pelicula.id },
        },
        relations: ['pelicula', 'sala'],
      });


      const existingSeats = await this.SeatRepository.find({
        where: {
          sala: { id: existingScreening.sala.id }, 
          salaF: { id: funcion.id }, 
        },
        relations: ['sala', 'salaF'], 
      });

       
      return{
        msg: "asientos disponibles",
        asientos: existingSeats.map((seat) => seat.posicion),
      }
    
  
    } catch (error) {
      this.logger.error('Error fetching movies', error);
      throw new Error('Error fetching movies'); 
    }
  }
  


  async getMovies(page: number = 1) {
    try {
      const limit = 10;

      const [movies, total] = await this.movieRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        order: { id: 'ASC' } // Opcional: ordenar por algún campo
      });
  
      const totalPages = Math.ceil(total / limit);
  
      return {
        movies,
        total,
        totalPages,
        currentPage: page,
        perPage: limit
      };
  
    } catch (error) {
      this.logger.error('Error fetching movies', error);
      throw new Error('Error fetching movies'); 
    }
  }

 
  
  
  

  
   




}
