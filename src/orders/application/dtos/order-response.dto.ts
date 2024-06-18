import { ApiProperty } from '@nestjs/swagger';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @ApiProperty({
    example: '60f7b3b3b3f3f3f3f3f3f3f3',
    description: 'Order ID',
  })
  id: string;

  @ApiProperty({
    example: '60f7b3b3b3f3f3f3f3f3f3f3',
    description: 'User ID',
  })
  userId: string;

  @ApiProperty({ example: 'User email', description: 'johndoe@gmail.com' })
  userEmail?: string;

  @ApiProperty({
    description: 'Items',
    type: OrderItemResponseDto,
    isArray: true,
  })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: 'pending', description: 'Order status' })
  status: string;

  @ApiProperty({ example: 10, description: 'Total amount' })
  totalAmount: number;

  @ApiProperty({ example: 10, description: 'Total items' })
  totalItems: number;

  @ApiProperty({ example: new Date(), description: 'Order creation date' })
  createdAt?: Date;

  @ApiProperty({ example: new Date(), description: 'Order update date' })
  updatedAt?: Date;
}
