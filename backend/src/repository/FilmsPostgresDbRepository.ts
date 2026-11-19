import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

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
    private readonly dataSource: DataSource,
  ) {}

  private mapFilm(film: Film): FilmDTO {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
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
      daytime: new Date(schedule.daytime).toISOString(),
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
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
      order: {
        schedules: {
          daytime: 'ASC',
        },
      },
    });

    if (!film) return null;

    return {
      total: film.schedules.length,
      items: film.schedules.map((schedule) => this.mapSchedule(schedule)),
    };
  }

  async takeSeats(
    filmId: string,
    seatsBySession: Map<string, Set<string>>,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ids = [...seatsBySession.keys()];

      const lockedSchedules = await queryRunner.manager
        .getRepository(Schedule)
        .createQueryBuilder('s')
        .where('s.filmId = :filmId', { filmId })
        .andWhere('s.id IN (:...ids)', { ids })
        .setLock('pessimistic_write')
        .getMany();

      if (lockedSchedules.length !== ids.length) {
        const missingSchedules = ids.filter(
          (id) => !lockedSchedules.some((s) => s.id === id),
        );

        throw new NotFoundException(
          `Сеансы не найдены: ${missingSchedules.join(', ')}`,
        );
      }
      for (const session of lockedSchedules) {
        const wanted = seatsBySession.get(session.id) ?? new Set<string>();
        const taken = session.taken;
        const busy = [...wanted].filter((seat) => taken.includes(seat));
        if (busy.length) {
          throw new ConflictException(
            `Места сеанса ${session.id} уже заняты: ${busy.join(', ')}`,
          );
        }
      }
      for (const session of lockedSchedules) {
        const wanted = seatsBySession.get(session.id) ?? new Set<string>();
        const merged = new Set(session.taken);
        for (const seat of wanted) merged.add(seat);
        session.taken = [...merged];
      }
      await queryRunner.manager.save(lockedSchedules);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async returnSeats(
    filmId: string,
    seatsBySession: Map<string, Set<string>>,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const changed: Schedule[] = [];

      for (const [scheduleId, seats] of seatsBySession) {
        const session = await queryRunner.manager
          .getRepository(Schedule)
          .createQueryBuilder('s')
          .where('s.filmId = :filmId', { filmId })
          .andWhere('s.id = :scheduleId', { scheduleId })
          .setLock('pessimistic_write')
          .getOne();

        if (!session) continue;

        session.taken = session.taken.filter((seat) => !seats.has(seat));
        changed.push(session);
      }

      if (changed.length) {
        await queryRunner.manager.save(changed);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
