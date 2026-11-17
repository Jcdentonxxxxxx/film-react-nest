import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Repository, In, IsNull, Not } from 'typeorm';
import {
  FilmDTO,
  FilmListDTO,
  ScheduleDTO,
  ScheduleListDTO,
} from '../films/dto/films.dto';
import { FilmsRepository } from './FilmsRepository';
import { Film } from '../database/entities/film.entity';
import { Schedule } from '../database/entities/schedule.entity';

@Injectable()
export class FilmsPostgresDbRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedulesRepository: Repository<Schedule>,
  ) {}

  private mapFilm(film: Film): FilmDTO {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags.split(','),
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private mapSchedule(schedule: Schedule): ScheduleDTO {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken.split(','),
    };
  }

  async findAll(): Promise<FilmListDTO> {
    const [films, total] = await Promise.all([
      this.filmsRepository.find(),
      this.filmsRepository.count(),
    ]);

    return {
      total,
      items: films.map((film) => this.mapFilm(film)),
    };
  }

  async findSchedule(id: string): Promise<ScheduleListDTO | null> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });

    if (!film) return null;

    return {
      total: film.schedules.length,
      items: film.schedules.map((schedule) => this.mapSchedule(schedule)),
    };
  }
}
