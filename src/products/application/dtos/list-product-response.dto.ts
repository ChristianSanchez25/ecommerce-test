import { ApiProperty } from '@nestjs/swagger';
import { Metadata } from '../../../common';
import { ProductResponseDto } from './product-response.dto';

export class ListProductResponseDto {
  @ApiProperty({
    type: [ProductResponseDto],
    description: 'products',
  })
  products: ProductResponseDto[];

  @ApiProperty({
    example: Metadata,
    description: 'total products, current page and total pages',
  })
  metadata: Metadata;
}
