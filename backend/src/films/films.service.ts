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

  async takeSeat(
    filmId: string,
    scheduleId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    return this.filmsRepository.takeSeat(filmId, scheduleId, row, seat);
  }
}
