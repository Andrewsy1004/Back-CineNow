
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';

import { MoviesService } from './movies.service';
import { createSeatMoviesDto, GetSeatMoviesDto } from './dto';

import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';


@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}


  
  @Post('seats')
  @Auth()
  async getMoviesSeats( @Body() getSeatMoviesDto: GetSeatMoviesDto ) {
    return await this.moviesService.getMoviesSeats( getSeatMoviesDto );
  }

   @Post('createSeats')
   @Auth()
   async createMoviesSeats(
     @Req() request: Express.Request,
     @GetUser('id') userId: string, 

     @Body() createseatDto: createSeatMoviesDto 
    ) {
    return await this.moviesService.createMoviesSeats( createseatDto, userId );
  }
 
 
  @Get('getMovies')
  @Auth()
  async getMoviesPagination(
    @Query('page') limit: number,
  ) {
       return await this.moviesService.getMovies( limit );
  }

  @Get('BillUser')
  @Auth()
  async getBillUser(
    @GetUser('id') userId: string,
  ) {
    return await this.moviesService.getBillByUser( userId );
  }  


  @Get('TicketUser')
  @Auth()
  async getTicketUser(
    @GetUser('id') userId: string,
  ) {
    return await this.moviesService.getTicketByUser( userId );
  }  

  @Get('GetGeneralStadistic')
  @Auth( ValidRoles.Administrador )  
  async getGeneralStadistic () {
    return await this.moviesService.getGeneralStatistics();
  }  

  @Get('SellByMonth')
  @Auth( ValidRoles.Administrador )  
  async getSellByMonth () {
    return await this.moviesService.getAmountOfSellsByMonth();
  }  

  @Get('GetMostPopularMovies')
  @Auth( ValidRoles.Administrador )  
  async GetMostPopularMovies () {
    return await this.moviesService.getTheMostPopularMovies();
  }  

  @Get('IncomesByAuditorium')
  @Auth( ValidRoles.Administrador )  
  async IncomesByAuditorium () {
    return await this.moviesService.GetTheRoomsWithMoreSells();
  }  



  


}
