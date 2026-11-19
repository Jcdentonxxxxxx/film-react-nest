import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createAppConfig } from './src/config/app.config.factory';

const configService = new ConfigService();
const appConfig = createAppConfig(configService);

const dbUrl = new URL(appConfig.database.url);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port || '5432'),
  database: dbUrl.pathname.slice(1),
  username: appConfig.database.username,
  password: appConfig.database.password,
  entities: [`${__dirname}/**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/**/database/migrations/**/*{.ts,.js}`],
  synchronize: false,
});
