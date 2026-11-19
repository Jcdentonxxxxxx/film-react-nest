import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'prac',
  password: 'prac',
  database: 'prac',
  entities: [`${__dirname}/**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/**/database/migrations/**/*{.ts,.js}`],
  synchronize: false,
});
