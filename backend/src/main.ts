import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { createWinstonConfig } from './config/logger.config';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { logAppConfig } from './utils/log-app-config';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const redisClient = app.get('REDIS_CLIENT');
  // await redisClient.set('docker_test', 'OK');
  // console.log(await redisClient.get('docker_test'));
  const configService = app.get(ConfigService);
  const logger = WinstonModule.createLogger(createWinstonConfig(configService));
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || 'http://localhost:8000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.useLogger(logger);
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
          statusCode: 400,
        });
      },
    }),
  );

  await app.listen(configService.get('PORT') ?? 3000);
  logAppConfig(configService, logger);
}
bootstrap();
