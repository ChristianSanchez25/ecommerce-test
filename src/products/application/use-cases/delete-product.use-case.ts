import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_PRODUCT } from '../../domain/constants';
import { IProductService } from '../interfaces';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(SERVICE_PRODUCT) private readonly productService: IProductService,
  ) {}

  async execute(id: string): Promise<string> {
    return await this.productService.deleteProduct(id);
  }
}
