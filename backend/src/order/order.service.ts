import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FilmsService } from 'src/films/films.service';
import { CreateOrderDTO } from './dto/order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsService: FilmsService) {}

  async createOrder(dto: CreateOrderDTO) {
    const order = new Map<string, Map<string, Set<string>>>();
    for (const t of dto.tickets) {
      const seatsBySession =
        order.get(t.film) ?? new Map<string, Set<string>>();
      const seats = seatsBySession.get(t.session) ?? new Set<string>();

      const seat = `${t.row}:${t.seat}`;
      if (seats.has(seat)) {
        throw new BadRequestException(
          `В заказе дублируется место ${t.row}:${t.seat}`,
        );
      }
      seats.add(seat);
      seatsBySession.set(t.session, seats);
      order.set(t.film, seatsBySession);
    }

    for (const [filmId, seatsBySession] of order) {
      const schedule = await this.filmsService.findSchedule(filmId);
      const takenBySession = new Map<string, string[]>(
        schedule.items.map((s) => [s.id, s.taken ?? []]),
      );

      for (const [sessionId, wanted] of seatsBySession) {
        const taken = takenBySession.get(sessionId);
        if (!taken) {
          throw new NotFoundException(`Сеанс ${sessionId} не найден`);
        }

        const busy = [...wanted].filter((seat) => taken.includes(seat));
        if (busy.length) {
          throw new ConflictException(`Заняты места: ${busy.join(', ')}`);
        }
      }
    }

    for (const t of dto.tickets) {
      const taken = await this.filmsService.takeSeat(
        t.film,
        t.session,
        t.row,
        t.seat,
      );
      if (!taken) {
        throw new ConflictException(`Место ${t.row}:${t.seat} уже занято`);
      }
    }

    const tickets = dto.tickets.map((order) => {
      return {
        ...order,
        id: randomUUID(),
      };
    });
    return {
      total: dto.tickets.length,
      items: tickets,
    };
  }
}
