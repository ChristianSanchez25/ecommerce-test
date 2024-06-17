import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from '../../../common';
import { SERVICE_PRODUCT } from '../../domain/constants';
import { ListProductResponseDto } from '../dtos';
import { IProductService } from '../interfaces';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(SERVICE_PRODUCT) private readonly productService: IProductService,
  ) {}

  async execute(pagination: PaginationDto): Promise<ListProductResponseDto> {
    const products = await this.productService.findAllProducts(pagination);
    const total = await this.productService.totalProducts();
    const { limit = 10, page = 1 } = pagination;

    return {
      products: products,
      metadata: {
        total,
        page: page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
