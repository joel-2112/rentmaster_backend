import { Module } from '@nestjs/common';
import { PropertyController } from './infrastructure/controllers/property.controller';
import { PrismaPropertyRepository } from './infrastructure/repositories/persistence/prisma-property.repository';
import { PropertyUseCase } from './application/use-cases/property.use-case';
import { PropertyMapper } from './application/mappers/property.mapper';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PropertyController],
  providers: [
    PrismaPropertyRepository,
    {
      provide: 'IPropertyRepository',
      useClass: PrismaPropertyRepository,
    },
    PropertyUseCase,
    PropertyMapper,
  ],
  exports: [PropertyUseCase],
})
export class PropertyModule {}