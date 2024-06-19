import { Test, TestingModule } from '@nestjs/testing';
import { createMockProductService, productsMock } from '../../../../../test';
import { SERVICE_PRODUCT } from '../../../domain/constants';
import { IProductService } from '../../interfaces';
import { UpdateProductUseCase } from '../update-product.use-case';

describe('UpdateProductUseCase', () => {
  // Arrange
  let updateProductUseCase: UpdateProductUseCase;
  let productService: IProductService;
  const productExpected = productsMock[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductUseCase,
        {
          provide: SERVICE_PRODUCT,
          useValue: createMockProductService(),
        },
      ],
    }).compile();

    updateProductUseCase =
      module.get<UpdateProductUseCase>(UpdateProductUseCase);
    productService = module.get(SERVICE_PRODUCT);
  });

  it('should be defined', () => {
    expect(updateProductUseCase).toBeDefined();
  });

  describe('updateProductUseCase', () => {
    it('should update a product', async () => {
      // Arrange
      const id = '1';
      const updateProductDto = {
        price: 100,
        quantity: 10,
        description: 'Product 1 description',
      };
      // Act
      const result = await updateProductUseCase.execute(id, updateProductDto);
      // Assert
      expect(result).toEqual(productExpected);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        id,
        updateProductDto,
      );
    });
    it('should throw an error if the product does not exist', async () => {
      // Arrange
      const id = '1';
      const updateProductDto = {
        price: 100,
        quantity: 10,
        description: 'Product 1 description',
      };
      productService.findProductById = jest.fn().mockResolvedValue(null);
      // Act
      try {
        await updateProductUseCase.execute(id, updateProductDto);
      } catch (error) {
        // Assert
        expect(error.message).toEqual(`Product with id ${id} not found`);
      }
    });
  });
});
