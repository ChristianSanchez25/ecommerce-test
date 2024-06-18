import { OrderStatus } from '../../domain/enums';
import { CreateOrderDto, OrderResponseDto, PaginationOrderDto } from '../dtos';

export interface IOrderService {
  createOrder(order: CreateOrderDto, userId: string): Promise<OrderResponseDto>;
  findAllOrders(pagination: PaginationOrderDto): Promise<OrderResponseDto[]>;
  findOrdersByUser(
    userId: string,
    pagination: PaginationOrderDto,
  ): Promise<OrderResponseDto[]>;
  findOrderById(id: string): Promise<OrderResponseDto>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<OrderResponseDto>;
  totalOrders(status?: string): Promise<number>;
}
