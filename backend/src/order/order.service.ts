import { Injectable, ConflictException } from '@nestjs/common';
import { FilmsService } from 'src/films/films.service';
import { CreateOrderDTO } from './dto/order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(private readonly filmsService: FilmsService) {}

  async createOrder(dto: CreateOrderDTO) {
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
        id: uuidv4(),
      };
    });
    return {
      total: dto.tickets.length,
      items: tickets,
    };
  }
}
