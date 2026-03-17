
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { getAuthConfig } from './auth-config';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'BETTER_AUTH',
      useFactory: (prisma: PrismaService) => {
        return getAuthConfig(prisma);
      },
      inject: [PrismaService],
    },
  ],
  exports: ['BETTER_AUTH'],
})
export class AuthModule {}