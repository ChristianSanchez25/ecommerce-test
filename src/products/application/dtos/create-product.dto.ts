import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Product name', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'Product description',
    description: 'Product description',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1024)
  description: string;

  @ApiProperty({ example: 10, description: 'Product price' })
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 10, description: 'Product quantity' })
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  quantity: number;
}
