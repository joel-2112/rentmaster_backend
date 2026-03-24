import { Module } from '@nestjs/common';
import { ContractController } from './infrastructure/controller/contract.controller';
import { PrismaContractRepository } from './infrastructure/repositories/persistence/prisma-contract.repository';
import { ContractUseCase } from './application/use-cases/contract.use-case';
import { ContractMapper } from './application/mappers/contract.mapper';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContractController],
  providers: [
    PrismaContractRepository,
    {
      provide: 'IContractRepository',
      useClass: PrismaContractRepository,
    },
    ContractUseCase,
    ContractMapper,
  ],
  exports: [ContractUseCase],
})
export class ContractModule {}