import { ApiProperty } from '@nestjs/swagger';
import { Metadata } from '../../../common';
import { OrderResponseDto } from './order-response.dto';

export class ListOrderResponseDto {
  @ApiProperty({
    type: [OrderResponseDto],
    description: 'orders',
  })
  orders: OrderResponseDto[];

  @ApiProperty({
    example: Metadata,
    description: 'total orders, current page and total pages',
  })
  metadata: Metadata;
}
