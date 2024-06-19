import { ProductDocument } from '../../../src/products/infrastructure/schemas/product.schema';

export const productsSchemaMock: ProductDocument[] = [
  {
    _id: '1',
    productCode: 'ABC',
    name: 'Product 1',
    description: 'Product 1 description',
    price: 100,
    quantity: 10,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as ProductDocument,
  {
    _id: '2',
    productCode: 'DEF',
    name: 'Product 2',
    description: 'Product 2 description',
    price: 200,
    quantity: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as ProductDocument,
  {
    _id: '3',
    productCode: 'GHI',
    name: 'Product 3',
    description: 'Product 3 description',
    price: 300,
    quantity: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as ProductDocument,
];
