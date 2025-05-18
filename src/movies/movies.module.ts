
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { Auditorium, Movie, MovieScreening, Seat, Sell } from './entities';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],

  imports: [
      AuthModule,
      TypeOrmModule.forFeature([ Movie, Auditorium, MovieScreening, Seat, Sell ]),
  ],

  

})
export class MoviesModule {}
