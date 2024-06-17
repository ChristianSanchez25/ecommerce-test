import { Inject, Injectable } from '@nestjs/common';
import { OrderMapper } from '../../../common';
import { SERVICE_ORDER } from '../../domain/constants';
import { ListOrderResponseDto, PaginationOrderDto } from '../dtos';
import { IOrderService } from '../interfaces';

@Injectable()
export class GetOrdersUseCase {
  constructor(
    @Inject(SERVICE_ORDER) private readonly orderService: IOrderService,
  ) {}

  async execute(
    pagintation: PaginationOrderDto,
  ): Promise<ListOrderResponseDto> {
    const orders = await this.orderService.findAllOrders(pagintation);
    const total = await this.orderService.totalOrders(pagintation.status);
    const { limit = 10, page = 1 } = pagintation;
    return {
      orders: orders.map((order) => OrderMapper.toDto(order)),
      metadata: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
