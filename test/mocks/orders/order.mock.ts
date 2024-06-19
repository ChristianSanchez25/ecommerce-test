import { Order } from '../../../src/orders/domain/entities';

export const ordersMock: Order[] = [
  {
    id: '1',
    user: '1',
    totalAmount: 100,
    items: [
      {
        product: '1',
        price: 50,
        quantity: 2,
      },
    ],
    totalItems: 2,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    user: '1',
    totalAmount: 100,
    items: [
      {
        product: '1',
        price: 50,
        quantity: 2,
      },
    ],
    totalItems: 2,
    status: 'COMPLETED',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
