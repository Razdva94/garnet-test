import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDataSourceOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<{
    host: string;
  }>('db')?.host,
  port: parseInt(
    configService.get<{
      port: string;
    }>('db')?.port || '5432',
  ),
  username: configService.get<{
    user: string;
  }>('db')?.user,
  password: configService.get<{
    pass: string;
  }>('db')?.pass,
  database: configService.get<{
    name: string;
  }>('db')?.name,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: configService.get('synchronize'),
});
