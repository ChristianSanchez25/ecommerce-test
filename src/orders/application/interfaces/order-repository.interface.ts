import { Order } from '../../domain/entities';
import { PaginationOrderDto } from '../dtos';

export interface IOrderRepository {
  createOrder(order: Order): Promise<Order>;
  findAll(pagination: PaginationOrderDto): Promise<Order[]>;
  findByUser(userId: string): Promise<Order[]>;
  totalOrders(status?: string): Promise<number>;
}
