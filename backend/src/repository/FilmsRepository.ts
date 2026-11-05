import { FilmListDTO, ScheduleListDTO } from '../films/dto/films.dto';

export interface FilmsRepository {
  findAll(): Promise<FilmListDTO>;
  findSchedule(id: string): Promise<ScheduleListDTO | null>;
}
