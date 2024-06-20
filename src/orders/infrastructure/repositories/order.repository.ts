import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import {
  DatabaseException,
  Order as OrderEnum,
  OrderMapper,
} from '../../../common';
import { OrderResponseDto, PaginationOrderDto } from '../../application/dtos';
import { IOrderRepository } from '../../application/interfaces';
import { Order } from '../../domain/entities';
import { OrderDocument } from '../schemas';

export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(order: Order): Promise<OrderResponseDto> {
    try {
      const orderSchema = new this.orderModel({
        ...order,
        userId: order.user,
        items: order.items.map((item) => ({
          productId: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      await orderSchema.save();
      return OrderMapper.toDto(orderSchema);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_CREATE_ORDER');
    }
  }

  async findById(id: string): Promise<OrderResponseDto> {
    try {
      const order = await this.orderModel
        .findById(id)
        .populate('user')
        .populate('items.product')
        .exec();
      if (!order) {
        return null;
      }
      return OrderMapper.toDto(order);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_ORDER_BY_ID');
    }
  }

  async findAll(pagination: PaginationOrderDto): Promise<OrderResponseDto[]> {
    const {
      limit = 10,
      page = 1,
      sort = 'updatedAt',
      status,
      order = OrderEnum.DESC,
    } = pagination;
    const sortOrder = order === OrderEnum.ASC ? 1 : -1;
    try {
      const orders = await this.orderModel
        .find(status ? { status } : {})
        .populate('user')
        .populate('items.product')
        .sort({ [sort]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      if (!orders) {
        return [];
      }
      return orders.map(OrderMapper.toDto);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_ORDERS');
    }
  }

  async findByUser(
    userId: string,
    pagination: PaginationOrderDto,
  ): Promise<OrderResponseDto[]> {
    const {
      limit = 10,
      page = 1,
      sort = 'updatedAt',
      order = OrderEnum.DESC,
      status,
    } = pagination;
    const sortOrder = order === OrderEnum.ASC ? 1 : -1;
    const findQuery = status ? { userId: userId, status } : { userId: userId };
    try {
      const orders = await this.orderModel
        .find(findQuery)
        .populate('items.product')
        .sort({ [sort]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      if (!orders) {
        return [];
      }
      return orders.map(OrderMapper.toDto);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_ORDERS_BY_USER');
    }
  }

  async updateStatus(id: string, status: string): Promise<OrderResponseDto> {
    try {
      const order = await this.orderModel
        .findByIdAndUpdate(id, { status }, { new: true })
        .populate('user')
        .populate('items.product')
        .exec();
      if (!order) {
        return null;
      }
      return OrderMapper.toDto(order);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_UPDATE_ORDER_STATUS');
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
