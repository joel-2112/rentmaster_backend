import { Module } from '@nestjs/common';
import { LocationController } from './infrastructure/controllers/location.controller';
import { PrismaLocationRepository } from './infrastructure/repositories/persistence/prisma-location.repository';
import { LocationUseCase } from './application/use-cases/location.use-case';
import { LocationMapper } from './application/mappers/location.mapper';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LocationController],
  providers: [
    // Repositories
    PrismaLocationRepository,
    {
      provide: 'ILocationRepository',
      useClass: PrismaLocationRepository,
    },
    // Use Cases
    LocationUseCase,
    // Mappers
    LocationMapper,
  ],
  exports: [LocationUseCase],
})
export class LocationModule {}