import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// we use this if we want to apply the guards globally, but for now we will apply them at the controller level
// import { RolesGuard } from './common/guards/roles.guard';
// import { AuthGuard } from './common/guards/auth.guard';
// import { APP_GUARD } from '@nestjs/core';
import { LocationModule } from './location/location.module';
import { PropertyModule } from './property/property.module';

// add this on the providers array if you want to apply the guards globally
//  {
//       provide: APP_GUARD,
//       useClass: AuthGuard,
//     },
//     {
//       provide: APP_GUARD,
//       useClass: RolesGuard,
//     },

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    LocationModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
