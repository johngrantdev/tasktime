import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });
  const configService = app.get(ConfigService);

  const appName = `${configService.get<string>('APP_NAME')} API Gateway` || '';
  const appDescription = configService.get<string>('APP_DESCRIPTION') || '';
  const port = configService.get<string>('API_GATEWAY_PORT') || '3000';
  const serverUrl = `${configService.get<string>('API_GATEWAY_URL') || 'localhost'}:${port}`;
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
  const frontEndUrl = configService.get<string>('FRONTEND_URL') || 'localhost';

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${appName}`)
    .setDescription(appDescription)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(apiPrefix, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // !! REMOVE FOR PRODUCTION !!
  // for dev only
  // nest will serve the frontend in production
  app.enableCors({
    origin: frontEndUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.use(cookieParser());

  await app.listen(port, () => {
    console.log(`${appName}\naccess from ${serverUrl}`);
  });
}
bootstrap();
