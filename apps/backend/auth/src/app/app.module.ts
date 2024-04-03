import { Module } from '@nestjs/common';
import { NatsModule } from './nats/nats.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    NatsModule,
  ],
})
export class AppModule {}
