import { Test, TestingModule } from '@nestjs/testing';
import { createMockProductService, productsMock } from '../../../../../test';
import { SERVICE_PRODUCT } from '../../../domain/constants';
import { Product } from '../../../domain/entities';
import { CreateProductDto } from '../../dtos';
import { IProductService } from '../../interfaces';
import { CreateProductUseCase } from '../create-product.use-case';

describe('CreateProductUseCase', () => {
  // Arrange
  let createProductUseCase: CreateProductUseCase;
  let productService: IProductService;
  const productExpected: Product = productsMock[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: SERVICE_PRODUCT,
          useValue: createMockProductService(),
        },
      ],
    }).compile();

    createProductUseCase =
      module.get<CreateProductUseCase>(CreateProductUseCase);
    productService = module.get(SERVICE_PRODUCT);
  });

  it('should be defined', () => {
    expect(createProductUseCase).toBeDefined();
  });

  describe('createProductUseCase', () => {
    it('should create a product', async () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        productCode: 'ABC',
        price: 100,
        quantity: 10,
        description: 'Product 1 description',
      };
      // Act
      const result = await createProductUseCase.execute(createProductDto);
      // Assert
      expect(result).toEqual(productExpected);
      expect(productService.createProduct).toHaveBeenCalledWith(
        createProductDto,
      );
    });
  });
});
