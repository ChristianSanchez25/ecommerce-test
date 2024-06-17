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
    const order = await this.orderService.createOrder(data, userId);
    return {
      id: order.id,
      userId: order.user,
      items: data.items,
      totalAmount: order.totalAmount,
      totalItems: order.totalItems,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
