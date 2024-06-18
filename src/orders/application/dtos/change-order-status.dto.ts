import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../domain/enums';

export class ChangeOrderStatusDto {
  @ApiProperty({
    example: OrderStatus.COMPLETED,
    description: 'Order status',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus, {
    message: `Valid status are ${OrderStatus.CANCELLED}, ${OrderStatus.COMPLETED} or ${OrderStatus.PENDING}`,
  })
  status: OrderStatus;
}
