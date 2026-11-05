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
}
