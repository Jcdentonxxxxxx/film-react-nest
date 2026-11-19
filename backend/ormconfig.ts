import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createAppConfig } from './src/config/app.config.factory';

const configService = new ConfigService();
const appConfig = createAppConfig(configService);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: appConfig.database.url,
  entities: [`${__dirname}/**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/**/database/migrations/**/*{.ts,.js}`],
  synchronize: false,
});
