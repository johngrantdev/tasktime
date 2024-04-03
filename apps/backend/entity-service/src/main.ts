import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const natsUrl = process.env.NATS_SERVER_URL;
  const natsPort = process.env.NATS_SERVER_PORT || '4222';
  const natsAddress = `nats://${natsUrl}:${natsPort}`;

  const logger = new Logger('Bootstrap');
  logger.log(`Connecting to NATS server at ${natsAddress}`);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: {
        name: 'NATS_SERVICE',
        servers: [natsAddress],
      },
    });
  microservice.listen();
  logger.log('Listening for NATS messages');
}

bootstrap();
