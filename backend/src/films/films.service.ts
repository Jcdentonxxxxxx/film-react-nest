import { Injectable, Inject } from '@nestjs/common';
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
    return this.filmsRepository.findSchedule(id);
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
