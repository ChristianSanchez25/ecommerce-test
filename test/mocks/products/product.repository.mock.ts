import { IProductRepository } from '../../../src/products/application/interfaces';
import { productsMock } from './product.mock';

export function createMockProductRepository(): IProductRepository {
  return {
    create: jest.fn().mockReturnValue(productsMock[0]),
    findAll: jest.fn().mockReturnValue(productsMock),
    findById: jest.fn((id: string) => {
      return Promise.resolve(productsMock.find((product) => product.id === id));
    }),
    update: jest.fn().mockReturnValue(productsMock[0]),
    delete: jest.fn().mockReturnValue(productsMock[0]),
    totalProducts: jest.fn().mockReturnValue(productsMock.length),
    validateProducts: jest.fn((ids: string[]) =>
      Promise.resolve(
        ids.map((id) => productsMock.find((product) => product.id === id)),
      ),
    ),
  };
}
