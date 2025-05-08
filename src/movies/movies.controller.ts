
import { Body, Controller, Get, Query } from '@nestjs/common';

import { MoviesService } from './movies.service';
import { GetSeatMoviesDto } from './dto';

import { Auth } from 'src/auth/decorators';


@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}


  
  @Get('seats')
  @Auth()
  async getMoviesSeats( @Body() getSeatMoviesDto: GetSeatMoviesDto ) {
    return await this.moviesService.getMoviesSeats( getSeatMoviesDto );
  }
 

  @Get('getMovies')
  @Auth()
  async getMoviesPagination(
    @Query('page') limit: number,
  ) {
       return await this.moviesService.getMovies( limit );
  }


}
