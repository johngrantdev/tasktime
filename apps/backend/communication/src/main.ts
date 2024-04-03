import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const natsAddress = `nats://${configService.get<string>(
    'NATS_SERVER_URL',
  )}:${configService.get<string>('NATS_SERVER_PORT')}`;

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: {
        servers: [natsAddress],
      },
    });
  microservice.listen();
}

bootstrap();
