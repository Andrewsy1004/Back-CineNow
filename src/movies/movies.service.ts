

import { Injectable, Logger, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { user } from 'src/auth/entities';
import { Auditorium, Movie, MovieScreening, Seat, Sell } from './entities';

import { AuthService } from 'src/auth/auth.service';
import { createSeatMoviesDto, GetSeatMoviesDto } from './dto';

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
    
    @InjectRepository(Sell)
    private readonly sellRepository: Repository<Sell>,

    private readonly authService: AuthService
  ) {}

   
  async getMoviesSeats( getSeatMoviesDto: GetSeatMoviesDto ){
    try {
      
      const { fecha, hora_inicio, hora_final, peliculaId } = getSeatMoviesDto;

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
        order: { id: 'ASC' } 
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

  async createMoviesSeats( createseatDto: createSeatMoviesDto, userId: string ) {
    try {
      
      const { posicion, hora_inicio, hora_final, fecha, id_pelicula, total, metodo_pago } = createseatDto;
      
      // Encontrar la funcion, para tomar rel id de la sala y la funcion
      const funcion = await this.funcionRepository.findOne({
        where: {
          pelicula: { id: id_pelicula },
          fecha,
          hora_inicio,
          hora_final,
        },
        relations: ['pelicula', 'sala'],
      });
       
      if (!funcion) throw new Error('Funcion not found');
      
      // Insertar los asientos en la tabla Seat
      const newSeats = posicion.map((pos) => {
        const seat = this.SeatRepository.create({
          posicion: pos,
          sala: { id: funcion.sala.id },
          salaF: { id: funcion.id },
        });
        return seat;
      });
     
      await this.SeatRepository.save(newSeats);
      
      // Generar la factura
      const newBill = this.sellRepository.create({
        user: { id: userId },
        Funcion: { id: funcion.id },
        fecha,
        total,
        metodo_pago,
        numero_asientos: posicion,
      });

      await this.sellRepository.save(newBill);
        

      return {
        msg: "asientos creados y factura generada"
      };

    } catch (error) {
      this.logger.error('Error creating movies', error);
      throw new Error('Error creating movies'); 
    }
  }
  

  async getBillByUser( userId: string ) {
    try {
         
      const bills = await this.sellRepository.find({
        where: {
          user: { id: userId },
        },
        relations: ['user', 'Funcion', 'Funcion.pelicula', 'Funcion.sala'],
      });

      if (!bills || bills.length === 0) {
        throw new Error('Bills not found');
      }

      const formattedBills = bills.map((bill) => ({
        ID: bill.id,
        Película: bill.Funcion?.pelicula?.titulo ?? 'Sin título',
        Entradas: bill.numero_asientos?.join(', ') ?? 'Sin asientos',
        Fecha: bill.fecha,
        Total: bill.total,
        Sala: bill.Funcion?.sala?.nombre ?? 'Sin sala',
      }));

      return {
        msg: 'facturas',
        bills: formattedBills,
      };
      
    }catch (error) {
      this.logger.error('Error fetching movies', error);
      throw new Error('Error fetching movies'); 
    }
  }

  
  async getTicketByUser( userId: string ) {
    try {

      const tickets = await this.sellRepository.find({
        where: {
          user: { id: userId },
        },
        relations: ['user', 'Funcion', 'Funcion.pelicula', 'Funcion.sala'],
      });

      if (!tickets || tickets.length === 0) throw new Error('Tickets not found');
      

      const formattedTickets = tickets.map((ticket) => ({
        ID: ticket.id,
        Película: ticket.Funcion?.pelicula?.titulo ?? 'Sin título',
        Entradas: ticket.numero_asientos?.join(', ') ?? 'Sin asientos',
        Fecha: ticket.fecha,
        Hora: ticket.Funcion?.hora_inicio + ':' + ticket.Funcion?.hora_final ,
        Total: ticket.total,
        Sala: ticket.Funcion?.sala?.nombre ?? 'Sin sala',
      }));

      return {
        msg: 'tickets',
        tickets: formattedTickets,
      };
      
    } catch (error) {
      this.logger.error('Error fetching movies', error);
      throw new Error('Error fetching movies'); 
    }
  }

  
   




}
