import { Order } from '../../domain/entities';
import { OrderResponseDto, PaginationOrderDto } from '../dtos';

export interface IOrderRepository {
  createOrder(order: Order): Promise<OrderResponseDto>;
  findAll(pagination: PaginationOrderDto): Promise<OrderResponseDto[]>;
  findByUser(
    userId: string,
    pagination: PaginationOrderDto,
  ): Promise<OrderResponseDto[]>;
  findById(id: string): Promise<OrderResponseDto>;
  updateStatus(id: string, status: string): Promise<OrderResponseDto>;
  totalOrders(status?: string): Promise<number>;
}
