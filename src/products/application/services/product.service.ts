import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ILogger, LOGGER_SERVICE, PaginationDto } from '../../../common';
import { REPOSITORY_PRODUCT } from '../../domain/constants';
import { Product } from '../../domain/entities';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { IProductRepository, IProductService } from '../interfaces';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject(REPOSITORY_PRODUCT)
    private readonly productRepository: IProductRepository,
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return await this.productRepository.create(createProductDto);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      this.logger.warn('ProductService', `Product with id ${id} not found`);
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return await this.productRepository.update(id, {
      ...product,
      ...updateProductDto,
    });
  }
  async deleteProduct(id: string): Promise<string> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      this.logger.warn('ProductService', `Product with id ${id} not found`);
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    if (await this.productRepository.delete(id)) {
      return `Product with id ${id} deleted`;
    }
    return `Product with id ${id} not deleted`;
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      this.logger.warn('ProductService', `Product with id ${id} not found`);
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    this.logger.log('ProductService', `Product with id ${id} found`);
    return product;
  }

  async findAllProducts(pagination: PaginationDto): Promise<Product[]> {
    const products = await this.productRepository.findAll(pagination);
    this.logger.log('ProductService', `Found ${products.length} products`);
    return products;
  }

  async totalProducts(): Promise<number> {
    const total = await this.productRepository.totalProducts();
    this.logger.log('ProductService', `Found ${total} products`);
    return total;
  }
}
