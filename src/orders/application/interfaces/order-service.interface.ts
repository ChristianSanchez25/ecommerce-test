import { Order } from '../../domain/entities';
import { CreateOrderDto, PaginationOrderDto } from '../dtos';

export interface IOrderService {
  createOrder(order: CreateOrderDto, userId: string): Promise<Order>;
  findAllOrders(pagination: PaginationOrderDto): Promise<Order[]>;
  findOrdersByUser(userId: string): Promise<Order[]>;
  totalOrders(status?: string): Promise<number>;
}
