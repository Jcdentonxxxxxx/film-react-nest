import { FilmListDTO, ScheduleListDTO } from '../films/dto/films.dto';

export interface FilmsRepository {
  findAll(): Promise<FilmListDTO>;
  findSchedule(id: string): Promise<ScheduleListDTO | null>;
  takeSeats(
    filmId: string,
    seatsBySession: Map<string, Set<string>>,
  ): Promise<void>;
  returnSeats(
    filmId: string,
    seatsBySession: Map<string, Set<string>>,
  ): Promise<void>;
}
