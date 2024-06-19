import { Test, TestingModule } from '@nestjs/testing';
import { createMockProductService } from '../../../../../test';
import { SERVICE_PRODUCT } from '../../../domain/constants';
import { IProductService } from '../../interfaces';
import { DeleteProductUseCase } from '../delete-product.use-case';

describe('DeleteProductUseCase', () => {
  // Arrange
  let deleteProductUseCase: DeleteProductUseCase;
  let productService: IProductService;
  const expected: string = 'Product deleted';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductUseCase,
        {
          provide: SERVICE_PRODUCT,
          useValue: createMockProductService(),
        },
      ],
    }).compile();

    deleteProductUseCase =
      module.get<DeleteProductUseCase>(DeleteProductUseCase);
    productService = module.get(SERVICE_PRODUCT);
  });

  it('should be defined', () => {
    expect(deleteProductUseCase).toBeDefined();
  });

  describe('deleteProductUseCase', () => {
    it('should delete a product', async () => {
      // Arrange
      const id = '1';
      // Act
      const result = await deleteProductUseCase.execute(id);
      // Assert
      expect(result).toEqual(expected);
      expect(productService.deleteProduct).toHaveBeenCalledWith(id);
    });
    it('should throw an error if the product does not exist', async () => {
      // Arrange
      const id = '1';
      productService.findProductById = jest.fn().mockResolvedValue(null);
      // Act
      try {
        await deleteProductUseCase.execute(id);
      } catch (error) {
        // Assert
        expect(error.message).toEqual(`Product with id ${id} not found`);
      }
    });
  });
});
