import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_ORDER } from '../../domain/constants';
import { ChangeOrderStatusDto, OrderResponseDto } from '../dtos';
import { IOrderService } from '../interfaces';

@Injectable()
export class ChangeOrderStatusUseCase {
  constructor(
    @Inject(SERVICE_ORDER) private readonly orderService: IOrderService,
  ) {}

  async execute(
    id: string,
    orderStatus: ChangeOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return await this.orderService.updateOrderStatus(id, orderStatus.status);
  }
}
