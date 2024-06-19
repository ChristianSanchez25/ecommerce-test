import { Test, TestingModule } from '@nestjs/testing';
import { createMockProductService, productsMock } from '../../../../../test';
import { PaginationDto } from '../../../../common';
import { SERVICE_PRODUCT } from '../../../domain/constants';
import { Product } from '../../../domain/entities';
import { IProductService } from '../../interfaces';
import { GetProductsUseCase } from '../get-products.use-case';

describe('GetProductsUseCase', () => {
  // Arrange
  let getProductsUseCase: GetProductsUseCase;
  let productService: IProductService;
  const productsExpected: Product[] = productsMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsUseCase,
        {
          provide: SERVICE_PRODUCT,
          useValue: createMockProductService(),
        },
      ],
    }).compile();

    getProductsUseCase = module.get<GetProductsUseCase>(GetProductsUseCase);
    productService = module.get(SERVICE_PRODUCT);
  });

  it('should be defined', () => {
    expect(getProductsUseCase).toBeDefined();
  });

  describe('getProductsUseCase', () => {
    it('should get products', async () => {
      // Act
      const pagination: PaginationDto = { page: 1, limit: 10 };
      const result = await getProductsUseCase.execute(pagination);
      // Assert
      expect(result.products.length).toEqual(productsExpected.length);
      expect(result.metadata.total).toEqual(productsExpected.length);
      expect(productService.findAllProducts).toHaveBeenCalled();
      expect(productService.totalProducts).toHaveBeenCalled();
    });
  });
});
