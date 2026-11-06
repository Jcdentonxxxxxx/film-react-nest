import { Inject } from '@nestjs/common';
import { Mongoose, Model } from 'mongoose';
import { FilmDTO, FilmListDTO, ScheduleListDTO } from '../films/dto/films.dto';
import { FilmsRepository } from './FilmsRepository';
import { FilmSchema, FilmDocument } from './shemas/film.schema';

export class FilmsMongoDbRepository implements FilmsRepository {
  private readonly filmModel: Model<any>;
  constructor(@Inject('DATABASE_CONNECTION') connection: Mongoose) {
    this.filmModel = connection.model('Film', FilmSchema);
  }

  private mapFilm(doc: FilmDocument): FilmDTO {
    return {
      id: doc._id.toString(),
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
  async findAll(): Promise<FilmListDTO> {
    const films = await this.filmModel.find({});
    const total = await this.filmModel.countDocuments({});

    return {
      total,
      items: films.map((film) => this.mapFilm(film)),
    };
  }

  async findSchedule(id: string): Promise<ScheduleListDTO> {
    const doc = await this.filmModel.findById(id);

    if (!doc) return null;

    return {
      total: doc.schedule.length,
      items: doc.schedule,
    };
  }
}
