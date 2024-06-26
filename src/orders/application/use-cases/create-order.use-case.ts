import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_ORDER } from '../../domain/constants';
import { CreateOrderDto, OrderResponseDto } from '../dtos';
import { IOrderService } from '../interfaces';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(SERVICE_ORDER) private readonly orderService: IOrderService,
  ) {}

  async execute(
    data: CreateOrderDto,
    userId: string,
  ): Promise<OrderResponseDto> {
    return await this.orderService.createOrder(data, userId);
  }
}
