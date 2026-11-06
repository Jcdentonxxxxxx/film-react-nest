//TODO реализовать DTO для /orders
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsString,
  Min,
  ValidateNested,
  Matches,
} from 'class-validator';

import { Type } from 'class-transformer';

export class TicketDTO {
  @IsMongoId()
  film: string;

  @IsString()
  session: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;

  @IsInt()
  price: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  daytime: string;
}

export class CreateOrderDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDTO)
  tickets: TicketDTO[];
}
