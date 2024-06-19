import { IOrderRepository } from '../../../src/orders/application/interfaces';
import { ordersMock } from './order.mock';

export function createOrderRepositoryMock(): IOrderRepository {
  return {
    createOrder: jest.fn().mockReturnValue(ordersMock[0]),
    findAll: jest.fn().mockReturnValue(ordersMock),
    findById: jest.fn().mockReturnValue(ordersMock[0]),
    updateStatus: jest.fn().mockReturnValue(ordersMock[0]),
    findByUser: jest.fn().mockReturnValue(ordersMock),
    totalOrders: jest.fn().mockReturnValue(ordersMock.length),
  };
}
