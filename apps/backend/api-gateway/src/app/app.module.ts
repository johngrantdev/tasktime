import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ItemModule } from './item/item.module';
import { NatsModule } from './nats/nats.module';
import { AuthModule } from './auth/auth.module';
import { OrgModule } from './org/org.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    NatsModule,
    AuthModule,
    ItemModule,
    OrgModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
