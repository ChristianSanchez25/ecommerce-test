import { Test, TestingModule } from '@nestjs/testing';
import { createMockProductService, productsMock } from '../../../../../test';
import { SERVICE_PRODUCT } from '../../../domain/constants';
import { Product } from '../../../domain/entities';
import { IProductService } from '../../interfaces';
import { GetProductUseCase } from '../get-product.use-case';

describe('GetProductUseCase', () => {
  // Arrange
  let getProductUseCase: GetProductUseCase;
  let productService: IProductService;
  const productExpected: Product = productsMock[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductUseCase,
        {
          provide: SERVICE_PRODUCT,
          useValue: createMockProductService(),
        },
      ],
    }).compile();

    getProductUseCase = module.get<GetProductUseCase>(GetProductUseCase);
    productService = module.get(SERVICE_PRODUCT);
  });

  it('should be defined', () => {
    expect(getProductUseCase).toBeDefined();
  });

  describe('getProductUseCase', () => {
    it('should get a product', async () => {
      // Arrange
      const id = '1';
      // Act
      const result = await getProductUseCase.execute(id);
      // Assert
      expect(result).toEqual(productExpected);
      expect(productService.findProductById).toHaveBeenCalledWith(id);
    });
  });
});
