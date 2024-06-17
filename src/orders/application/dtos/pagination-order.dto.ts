import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common';
import { OrderStatus } from '../../domain/enums';

export class PaginationOrderDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
