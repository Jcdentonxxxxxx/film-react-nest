import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { FilmsMongoDbRepository } from '../repository/FilmsMongoDbRepository';

@Module({
  controllers: [FilmsController],
  providers: [
    FilmsService,
    { provide: 'FilmsRepository', useClass: FilmsMongoDbRepository },
  ],
})
export class FilmsModule {}
