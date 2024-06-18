import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_ORDER } from '../../domain/constants';
import { OrderResponseDto } from '../dtos';
import { IOrderService } from '../interfaces';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(SERVICE_ORDER) private readonly orderService: IOrderService,
  ) {}

  async execute(id: string): Promise<OrderResponseDto> {
    return await this.orderService.findOrderById(id);
  }
}
