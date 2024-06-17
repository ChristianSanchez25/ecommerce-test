import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { DatabaseException, OrderMapper } from '../../../common';
import { PaginationOrderDto } from '../../application/dtos';
import { IOrderRepository } from '../../application/interfaces';
import { Order } from '../../domain/entities';
import { OrderDocument } from '../schemas';

export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(order: Order): Promise<Order> {
    try {
      const orderSchema = new this.orderModel(order);
      await orderSchema.save();
      return OrderMapper.toEntity(orderSchema);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_CREATE_ORDER');
    }
  }

  async findAll(pagination: PaginationOrderDto): Promise<Order[]> {
    const { limit = 10, page = 1, sort = 'updatedAt', status } = pagination;
    try {
      const orders = await this.orderModel
        .find(status ? { status } : {})
        .sort({ [sort]: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      if (!orders) {
        return [];
      }
      return orders.map(OrderMapper.toEntity);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_ORDERS');
    }
  }

  async findByUser(userId: string): Promise<Order[]> {
    try {
      const orders = await this.orderModel
        .find({ userId })
        .sort({ updatedAt: -1 })
        .exec();
      if (!orders) {
        return [];
      }
      return orders.map(OrderMapper.toEntity);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_ORDERS_BY_USER');
    }
  }

  async totalOrders(status?: string): Promise<number> {
    try {
      return await this.orderModel
        .countDocuments(status ? { status } : {})
        .exec();
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_TOTAL_ORDERS');
    }
  }

  private handleDatabaseError(error: any, errorCode: string): never {
    if (error instanceof MongooseError) {
      throw new DatabaseException(error.message, errorCode);
    }
    throw new InternalServerErrorException(error.message, errorCode);
  }
}
