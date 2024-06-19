import { Product } from '../../../src/products/domain/entities';

export const productsMock: Product[] = [
  {
    id: '1',
    productCode: 'ABC',
    name: 'Product 1',
    description: 'Product 1 description',
    price: 100,
    quantity: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    productCode: 'DEF',
    name: 'Product 2',
    description: 'Product 2 description',
    price: 200,
    quantity: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    productCode: 'GHI',
    name: 'Product 3',
    description: 'Product 3 description',
    price: 300,
    quantity: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
