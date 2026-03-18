import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserRepository } from './infrastructure/repositories//persistence/prisma-user.repository';
import { UserUseCase } from './application/use-cases/user.use-case';
import { UserMapper } from './application/mappers/user.mapper';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserUseCase,
    UserMapper,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UserUseCase],
})
export class UsersModule {}