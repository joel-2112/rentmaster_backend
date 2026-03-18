import { Module } from '@nestjs/common';
import { LocationController } from './infrastructure/controllers/location.controller';
import { PrismaLocationRepository } from './infrastructure/repositories/persistence/prisma-location.repository';
import { LocationUseCase } from './application/use-cases/location.use-case';
import { LocationMapper } from './application/mappers/location.mapper';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LocationController],
  providers: [
    PrismaLocationRepository,
    {
      provide: 'ILocationRepository',
      useClass: PrismaLocationRepository,
    },
    LocationUseCase,
    LocationMapper,
  ],
  exports: [LocationUseCase],
})
export class LocationModule {}