
import { Body, Controller, Get } from '@nestjs/common';

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



}
