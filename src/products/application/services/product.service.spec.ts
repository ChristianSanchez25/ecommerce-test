import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  createMockLogger,
  createMockProductRepository,
  productsMock,
} from '../../../../test';
import { ILogger, LOGGER_SERVICE } from '../../../common';
import { REPOSITORY_PRODUCT } from '../../domain/constants';
import { Product } from '../../domain/entities';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { IProductRepository } from '../interfaces';
import { ProductService } from './product.service';

describe('ProductService', () => {
  // Arrange
  let productService: ProductService;
  let productRepository: IProductRepository;
  let logger: ILogger;
  const productExpected: Product = productsMock[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: REPOSITORY_PRODUCT,
          useValue: createMockProductRepository(),
        },
        {
          provide: LOGGER_SERVICE,
          useValue: createMockLogger(),
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get(REPOSITORY_PRODUCT);
    logger = module.get(LOGGER_SERVICE);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        productCode: 'ABC',
        price: 100,
        quantity: 10,
        description: 'Product 1 description',
      };
      const result = await productService.createProduct(createProductDto);
      expect(result).toEqual(productExpected);
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('updateProduct', () => {
    it('should update a product if it exists', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const product = productsMock[0];
      productRepository.findById = jest.fn().mockResolvedValue(product);
      productRepository.update = jest
        .fn()
        .mockResolvedValue({ ...product, ...updateProductDto });

      const result = await productService.updateProduct('1', updateProductDto);
      expect(result).toEqual({ ...product, ...updateProductDto });
      expect(productRepository.findById).toHaveBeenCalledWith('1');
      expect(productRepository.update).toHaveBeenCalledWith('1', {
        ...product,
        ...updateProductDto,
      });
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      productRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(productService.updateProduct('1', {})).rejects.toThrow(
        NotFoundException,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        'ProductService',
        'Product with id 1 not found',
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product if it exists', async () => {
      const product = productsMock[0];
      productRepository.findById = jest.fn().mockResolvedValue(product);
      productRepository.delete = jest.fn().mockResolvedValue(true);

      const result = await productService.deleteProduct('1');
      expect(result).toEqual('Product with id 1 deleted');
      expect(productRepository.findById).toHaveBeenCalledWith('1');
      expect(productRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      productRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(productService.deleteProduct('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        'ProductService',
        'Product with id 1 not found',
      );
    });
  });

  describe('findProductById', () => {
    it('should return a product if it exists', async () => {
      const product = productsMock[0];
      productRepository.findById = jest.fn().mockResolvedValue(product);

      const result = await productService.findProductById('1');
      expect(result).toEqual(product);
      expect(productRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      productRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(productService.findProductById('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        'ProductService',
        'Product with id 1 not found',
      );
    });
  });

  describe('findAllProducts', () => {
    it('should return an array of products', async () => {
      const products = productsMock;
      productRepository.findAll = jest.fn().mockResolvedValue(products);

      const result = await productService.findAllProducts({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(products);
      expect(productRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(logger.log).toHaveBeenCalledWith(
        'ProductService',
        `Found ${products.length} products`,
      );
    });
  });

  describe('totalProducts', () => {
    it('should return the total number of products', async () => {
      productRepository.totalProducts = jest
        .fn()
        .mockResolvedValue(productsMock.length);

      const result = await productService.totalProducts();
      expect(result).toEqual(productsMock.length);
      expect(productRepository.totalProducts).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        'ProductService',
        `Found ${productsMock.length} products`,
      );
    });
  });
});
