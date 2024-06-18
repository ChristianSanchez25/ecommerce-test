import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_ORDER } from '../../domain/constants';
import { OrderResponseDto, PaginationOrderDto } from '../dtos';
import { IOrderService } from '../interfaces';
@Injectable()
export class GetOrdersByUserUseCase {
  constructor(
    @Inject(SERVICE_ORDER) private readonly orderService: IOrderService,
  ) {}

  async execute(
    userId: string,
    pagintation: PaginationOrderDto,
  ): Promise<OrderResponseDto[]> {
    return await this.orderService.findOrdersByUser(userId, pagintation);
  }
}
