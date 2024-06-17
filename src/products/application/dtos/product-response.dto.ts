import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    example: '60f7b3b3b3f3f3f3f3f3f3f3',
    description: 'Product ID',
  })
  id: string;

  @ApiProperty({ example: 'Product name', description: 'Product name' })
  name: string;

  @ApiProperty({
    example: 'Product description',
    description: 'Product description',
  })
  description: string;

  @ApiProperty({ example: 10, description: 'Product price' })
  price: number;

  @ApiProperty({ example: 10, description: 'Product quantity' })
  quantity: number;

  @ApiProperty({ example: new Date(), description: 'Product creation date' })
  createdAt?: Date;

  @ApiProperty({ example: new Date(), description: 'Product update date' })
  updatedAt?: Date;
}
