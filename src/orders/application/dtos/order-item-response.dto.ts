import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({
    example: '60f7b3b3b3f3f3f3f3f3f3f3',
    description: 'Product ID',
  })
  productId: string;
  @ApiProperty({ example: 'Product name', description: 'Product name' })
  productName?: string;
  @ApiProperty({ example: true, description: 'Product availability' })
  available?: boolean;
  @ApiProperty({ example: 1, description: 'Quantity' })
  quantity: number;
  @ApiProperty({ example: 10, description: 'Price' })
  price: number;
}
