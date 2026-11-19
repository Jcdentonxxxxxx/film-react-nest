import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigCustomModule } from '../config/config.module';
import { AppConfig } from '../config/app.config.factory';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

@Module({
  imports: [
    ConfigCustomModule,
    TypeOrmModule.forRootAsync({
      inject: ['CONFIG'],
      useFactory: (config: AppConfig) => {
        const dbUrl = new URL(config.database.url);
        return {
          type: 'postgres',
          host: dbUrl.hostname,
          port: parseInt(dbUrl.port || '5432'),
          database: dbUrl.pathname.slice(1),
          username: config.database.username,
          password: config.database.password,
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
