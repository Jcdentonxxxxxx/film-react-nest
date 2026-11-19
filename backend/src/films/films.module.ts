import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
// import { FilmsMongoDbRepository } from '../repository/FilmsMongoDbRepository';
import { FilmsPostgresDbRepository } from '../repository/FilmsPostgresDbRepository';

@Module({
  imports: [DatabaseModule],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    { provide: 'FilmsRepository', useClass: FilmsPostgresDbRepository },
  ],
  exports: [FilmsService],
})
export class FilmsModule {}
