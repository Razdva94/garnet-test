import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

const envFile = `.env.${process.env.ENV_FILE || 'development.local'}`;
config({ path: path.resolve(process.cwd(), envFile) });

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
});
