import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_PRODUCT } from '../../domain/constants';
import { ProductResponseDto } from '../dtos';
import { IProductService } from '../interfaces';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(SERVICE_PRODUCT) private readonly productService: IProductService,
  ) {}

  async execute(id: string): Promise<ProductResponseDto> {
    return await this.productService.findProductById(id);
  }
}
