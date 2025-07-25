import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSourceOptions } from './db/data-source';
import { WinstonModule } from 'nest-winston';
import { createWinstonConfig } from './config/logger.config';
// import { RedisModule } from './redis/redis.module';
import appConfig from './config/configuration';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
const envFilePath = process.env.ENV_FILE;
@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => getDataSourceOptions(config),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createWinstonConfig(configService),
    }),
    // RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
