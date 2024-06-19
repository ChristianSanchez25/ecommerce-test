import { IProductService } from '../../../src/products/application/interfaces';
import { productsMock } from './product.mock';

export function createMockProductService(): IProductService {
  return {
    createProduct: jest.fn().mockReturnValue(productsMock[0]),
    findAllProducts: jest.fn().mockReturnValue(productsMock),
    findProductById: jest.fn((id: string) => {
      return Promise.resolve(productsMock.find((product) => product.id === id));
    }),
    updateProduct: jest.fn().mockReturnValue(productsMock[0]),
    deleteProduct: jest.fn((id: string) => {
      if (productsMock.find((product) => product.id === id)) {
        return Promise.resolve('Product deleted');
      }
    }),
    totalProducts: jest.fn().mockReturnValue(productsMock.length),
  };
}
