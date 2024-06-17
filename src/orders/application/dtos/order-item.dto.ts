import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsPositive, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    example: '60f7b3b3b3f3f3f3f3f3f3f3',
    description: 'Product ID',
  })
  @IsMongoId()
  @IsString()
  productId: string;
  @ApiProperty({ example: 1, description: 'Quantity' })
  @IsNumber()
  @IsPositive()
  quantity: number;
  @ApiProperty({ example: 10, description: 'Price' })
  @IsNumber()
  @IsPositive()
  price: number;
}
