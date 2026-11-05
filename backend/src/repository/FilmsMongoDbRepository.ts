import { Injectable } from '@nestjs/common';
import {
  FilmDTO,
  FilmListDTO,
  ScheduleDTO,
  ScheduleListDTO,
} from '../films/dto/films.dto';
import { FilmsRepository } from './FilmsRepository';
import { Film, FilmDocument } from './shemas/film.schema';

export class FilmsMongoDbRepository implements FilmsRepository {
  private films: (FilmDTO & { schedule: ScheduleDTO[] })[] = [
    {
      id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Документальный'],
      title: 'Архитекторы общества',
      about:
        'Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.',
      description:
        'Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.',
      image: '/bg1s.jpg',
      cover: '/bg1c.jpg',
      schedule: [
        {
          id: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          daytime: '2024-06-28T10:00:53+03:00',
          hall: 0,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
        {
          id: '5beec101-acbb-4158-adc6-d855716b44a8',
          daytime: '2024-06-28T14:00:53+03:00',
          hall: 1,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
      ],
    },
    {
      id: '111111111111111111111111111111111',
      rating: 3,
      director: 'Райт[ty,thu',
      tags: ['Художественный'],
      title: 'Художественный быт',
      about:
        'Художественный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.',
      description:
        'Художественный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.',
      image: '/bg2s.jpg',
      cover: '/bg2c.jpg',
      schedule: [
        {
          id: 'eed1469f-c95e-428a-870d-13cbfe4ac2ac',
          daytime: '2024-06-30T16:00:53+03:00',
          hall: 1,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
        {
          id: '68437c84-6c35-4203-bff7-021d16042a6b',
          daytime: '2024-06-30T18:00:53+03:00',
          hall: 2,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
      ],
    },
  ];

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
    // const docs = await Film.find({});
    // const total = await Film.countDocuments({});
    const docs = this.films;
    const total = this.films.length;
    return {
      total,
      items: docs,
    };
  }

  async findSchedule(id: string): Promise<ScheduleListDTO> {
    // const doc = await Film.findById(id).lean();
    const doc = this.films.find((item) => item.id === id);
    if (!doc) return null;

    return {
      total: doc.schedule.length,
      items: doc.schedule,
    };
  }
}
