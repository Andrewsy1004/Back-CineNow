

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvConfiguration, joiValidationSchema } from './config';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
       
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: joiValidationSchema,
    }),
    
    TypeOrmModule.forRoot({
      type:             'postgres',
      host:             process.env.DB_HOST,
      port:             +process.env.DB_PORT,
      database:         process.env.DB_NAME,
      username:         process.env.DB_USERNAME,
      password:         process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize:      true,
    }),
    
    AuthModule,
    
    MoviesModule,
    
    SeedModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
