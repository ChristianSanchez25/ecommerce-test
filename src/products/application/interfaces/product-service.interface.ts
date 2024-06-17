import { PaginationDto } from '../../../common';
import { Product } from '../../domain/entities';
import { CreateProductDto, UpdateProductDto } from '../dtos';

export interface IProductService {
  createProduct(createProductDto: CreateProductDto): Promise<Product>;
  updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product>;
  deleteProduct(id: string): Promise<string>;
  findProductById(id: string): Promise<Product>;
  findAllProducts(pagination: PaginationDto): Promise<Product[]>;
  totalProducts(): Promise<number>;
}
