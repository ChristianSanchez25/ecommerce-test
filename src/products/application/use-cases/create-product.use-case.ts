import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_PRODUCT } from '../../domain/constants';
import { CreateProductDto, ProductResponseDto } from '../dtos';
import { IProductService } from '../interfaces';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(SERVICE_PRODUCT) private readonly productService: IProductService,
  ) {}

  async execute(data: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productService.createProduct(data);
    return product;
  }
}
