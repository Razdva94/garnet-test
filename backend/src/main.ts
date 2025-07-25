import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { createWinstonConfig } from './config/logger.config';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { logAppConfig } from './utils/log-app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const redisClient = app.get('REDIS_CLIENT');
  // await redisClient.set('docker_test', 'OK');
  // console.log(await redisClient.get('docker_test'));
  const configService = app.get(ConfigService);
  const logger = WinstonModule.createLogger(createWinstonConfig(configService));
  app.useLogger(logger);
  app.use(cookieParser());

  await app.listen(configService.get('PORT') ?? 3000);
  logAppConfig(configService, logger);
}
bootstrap();
