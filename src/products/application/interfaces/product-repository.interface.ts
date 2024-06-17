import { PaginationDto } from '../../../common';
import { Product } from '../../domain/entities';
import { CreateProductDto, UpdateProductDto } from '../dtos';

export interface IProductRepository {
  create(data: CreateProductDto): Promise<Product>;
  findById(id: string): Promise<Product>;
  update(id: string, data: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<boolean>;
  findAll(pagination: PaginationDto): Promise<Product[]>;
  validateProducts(ids: string[]): Promise<Product[]>;
  totalProducts(): Promise<number>;
}
