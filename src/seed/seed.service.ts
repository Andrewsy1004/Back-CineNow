
import axios from 'axios';

import { Injectable, Logger } from '@nestjs/common';
import { genreMap } from 'src/Constant';


@Injectable()
export class SeedService {
  
  private readonly logger = new Logger('SeedService');
  private readonly apiKey = process.env.API_KEY_TMDB;
  
  constructor(
    
  ) {}
  
  async getFirst100Movies() {
      const movies = [];
         
      try {
        for (let page = 1; page <= 3; page++) {
          const url = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=es-ES&page=${page}`;
          const response = await axios.get(url);
          movies.push(...response.data.results);
        }
  
        const moviesWithGenres = movies.map((movie) => ({
          id: movie.id,
          titulo: movie.title,
          descripcion: movie.overview,
          Poster: movie.backdrop_path,
          generos: movie.genre_ids.map((id) => genreMap[id] || 'Desconocido'),
          promedio: movie.vote_average,
          fecha_lanzamiento: movie.release_date,
          genre_ids: undefined,
        }));
  
        return moviesWithGenres;
      } catch (error) {
        return {
          msg: 'Error al obtener las películas',
          error: error.message,
        };
      }
    } 
  

  // async uploadMoviesToDB() {
  //   try {
  //     const result = await this.getFirst100Movies();
  //     const usuarioId = await this.authService.getAdminUser();
      
  //     if (!Array.isArray(result)) {
  //       this.logger.error(`Error al obtener películas: ${result.msg}`);
  //       return {
  //         success: false,
  //         message: result.msg,
  //         error: result.error
  //       };
  //     }
      
  //     const movies = result;
        
  //     let moviesAdded = 0;

  //     for (const movie of movies) {
  //       const existingMovie = await this.movieRepository.findOne({ where: { id: (movie.id) } });
        
  //       if (!existingMovie) {
  //         const newMovie = this.movieRepository.create({
  //           id: (movie.id),
  //           titulo: movie.titulo,
  //           descripcion: movie.descripcion,
  //           Poster: movie.Poster,
  //           generos: movie.generos,
  //           promedio: (movie.promedio),
  //           fecha_lanzamiento: movie.fecha_lanzamiento,
  //           usuario: { id: usuarioId.id }, 
  //         });
          
  //         await this.movieRepository.save(newMovie);
  //         moviesAdded++;
  //       }
  //     }
      
  //     return {
  //       success: true,
  //       message: `Se agregaron ${moviesAdded} películas a la base de datos`
  //     };

  //   } catch (error) {
  //     this.logger.error(`Error al subir películas a la base de datos: ${error.message}`);
  //     return {
  //       success: false,
  //       message: 'Error al subir películas a la base de datos',
  //       error: error.message
  //     };
  //   }
  // }


}
