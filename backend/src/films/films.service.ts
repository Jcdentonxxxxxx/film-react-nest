import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/FilmsRepository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FilmsRepository')
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async findAll() {
    return this.filmsRepository.findAll();
  }

  async findSchedule(id: string) {
    const schedule = this.filmsRepository.findSchedule(id);
    if (!schedule) {
      throw new NotFoundException(`Фильм с id ${id} не найден`);
    }
    return schedule;
  }

  async takeSeats(
    filmId: string,
    seatsBySession: Map<string, Set<string>>,
  ): Promise<void> {
    return this.filmsRepository.takeSeats(filmId, seatsBySession);
  }

  async returnSeats(
    filmId: string,
    seatsBySession: Map<string, Set<string>>,
  ): Promise<void> {
    return this.filmsRepository.returnSeats(filmId, seatsBySession);
  }
}
