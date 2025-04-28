
import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  
  imports: [
     AuthModule,
  ],

  
})
export class SeedModule {}
