import { Module } from '@nestjs/common';
import { PropertyController } from './infrastructure/controllers/property.controller';
import { PrismaPropertyRepository } from './infrastructure/repositories/persistence/prisma-property.repository';
import { PropertyUseCase } from './application/use-cases/property.use-case';
import { PropertyMapper } from './application/mappers/property.mapper';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController],
  providers: [
    // Repositories
    PrismaPropertyRepository,
    {
      provide: 'IPropertyRepository',
      useClass: PrismaPropertyRepository,
    },
    // Use Cases
    PropertyUseCase,
    // Mappers
    PropertyMapper,
  ],
  exports: [PropertyUseCase],
})
export class PropertyModule {}