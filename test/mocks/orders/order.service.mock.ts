import { IOrderService } from '../../../src/orders/application/interfaces';
import { ordersMock } from './order.mock';

export function createOrderServiceMock(): IOrderService {
  return {
    createOrder: jest.fn().mockReturnValue(ordersMock[0]),
    findAllOrders: jest.fn().mockReturnValue(ordersMock),
    findOrderById: jest.fn().mockReturnValue(ordersMock[0]),
    updateOrderStatus: jest.fn().mockReturnValue(ordersMock[0]),
    findOrdersByUser: jest.fn().mockReturnValue(ordersMock),
    totalOrders: jest.fn().mockReturnValue(ordersMock.length),
  };
}
