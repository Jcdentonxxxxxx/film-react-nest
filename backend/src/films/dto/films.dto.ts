//TODO описать DTO для запросов к /films
export class FilmDTO {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export class FilmListDTO {
  total: number;
  items: FilmDTO[];
}

export class ScheduleDTO {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class ScheduleListDTO {
  total: number;
  items: ScheduleDTO[];
}
