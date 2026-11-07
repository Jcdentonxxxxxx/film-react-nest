import { Inject } from '@nestjs/common';
import { Mongoose, Model } from 'mongoose';
import {
  FilmDTO,
  FilmListDTO,
  ScheduleDTO,
  ScheduleListDTO,
} from '../films/dto/films.dto';
import { FilmsRepository } from './FilmsRepository';
import {
  FilmSchema,
  FilmDocument,
  ScheduleDocument,
} from './shemas/film.schema';

export class FilmsMongoDbRepository implements FilmsRepository {
  private readonly filmModel: Model<any>;
  constructor(@Inject('DATABASE_CONNECTION') connection: Mongoose) {
    this.filmModel = connection.model('Film', FilmSchema);
  }

  private mapFilm(doc: FilmDocument): FilmDTO {
    return {
      id: doc.id,
      rating: doc.rating,
      director: doc.director,
      tags: doc.tags,
      title: doc.title,
      about: doc.about,
      description: doc.description,
      image: doc.image,
      cover: doc.cover,
    };
  }

  private mapSchedule(doc: ScheduleDocument): ScheduleDTO {
    return {
      id: doc.id,
      daytime: doc.daytime,
      hall: doc.hall,
      rows: doc.rows,
      seats: doc.seats,
      price: doc.price,
      taken: doc.taken,
    };
  }

  async findAll(): Promise<FilmListDTO> {
    const films = await this.filmModel.find({});
    const total = await this.filmModel.countDocuments({});

    return {
      total,
      items: films.map((film) => this.mapFilm(film)),
    };
  }

  async findSchedule(id: string): Promise<ScheduleListDTO | null> {
    const doc = await this.filmModel.findOne({ id });

    if (!doc) return null;

    return {
      total: doc.schedule.length,
      items: doc.schedule.map((schedule) => this.mapSchedule(schedule)),
    };
  }

  async takeSeat(
    filmId: string,
    scheduleId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const result = await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': scheduleId },
      { $addToSet: { 'schedule.$.taken': `${row}:${seat}` } },
    );

    return result.modifiedCount > 0;
  }
}
