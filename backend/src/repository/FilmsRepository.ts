import { FilmListDTO, ScheduleListDTO } from '../films/dto/films.dto';

export interface FilmsRepository {
  findAll(): Promise<FilmListDTO>;
  findSchedule(id: string): Promise<ScheduleListDTO | null>;
  takeSeat(
    filmId: string,
    scheduleId: string,
    row: number,
    seat: number,
  ): Promise<boolean>;
}
