import { ApiProperty } from '@nestjs/swagger';

export class Metadata {
  @ApiProperty({
    example: 1,
    description: 'current page',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'items per page',
  })
  lastPage: number;

  @ApiProperty({
    example: 10,
    description: 'total items',
  })
  total: number;
}
