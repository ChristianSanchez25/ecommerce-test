import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_PRODUCT } from '../../domain/constants';
import { ProductResponseDto, UpdateProductDto } from '../dtos';
import { IProductService } from '../interfaces';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(SERVICE_PRODUCT) private readonly productService: IProductService,
  ) {}

  async execute(
    id: string,
    product: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productService.updateProduct(id, product);
  }
}
