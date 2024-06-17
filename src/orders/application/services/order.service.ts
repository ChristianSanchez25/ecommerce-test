import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ILogger, LOGGER_SERVICE } from '../../../common';
import { IProductRepository } from '../../../products/application/interfaces';
import { REPOSITORY_PRODUCT } from '../../../products/domain/constants';
import { Product } from '../../../products/domain/entities';
import { REPOSITORY_ORDER } from '../../domain/constants';
import { Order } from '../../domain/entities';
import { OrderStatus } from '../../domain/enums';
import { CreateOrderDto, PaginationOrderDto } from '../dtos';
import { IOrderRepository, IOrderService } from '../interfaces';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(REPOSITORY_PRODUCT)
    private readonly productRepository: IProductRepository,
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
    @Inject(REPOSITORY_ORDER)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async createOrder(
    createOrder: CreateOrderDto,
    userId: string,
  ): Promise<Order> {
    const productsIds = createOrder.items.map((item) => item.productId);
    const products = await this.productRepository.validateProducts(productsIds);

    const productsMap = new Map(
      products.map((product) => [product.id, product]),
    );

    let totalAmount = 0;
    let totalItems = 0;

    for (const item of createOrder.items) {
      const product = productsMap.get(item.productId);
      this.validateQuantity(product, item.quantity);
      totalAmount += product.price * item.quantity;
      totalItems += item.quantity;
    }

    const orderItems = createOrder.items.map((item) => {
      const product = productsMap.get(item.productId);
      return {
        product: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await this.orderRepository.createOrder(
      new Order(
        '',
        userId,
        orderItems,
        OrderStatus.PENDING,
        totalAmount,
        totalItems,
      ),
    );

    for (const item of createOrder.items) {
      const product = productsMap.get(item.productId);
      await this.updateProductsQuantity(product, item.quantity);
    }

    this.logger.log('OrderService', `Order with id ${order.id} created`);
    return order;
  }

  private validateQuantity(product: Product, quantity: number): void {
    if (product.quantity < quantity) {
      this.logger.warn(
        'OrderService',
        `Product with id ${product.id} has insufficient quantity`,
      );
      throw new BadRequestException(
        `Product with id ${product.id} has insufficient quantity`,
      );
    }
  }

  private async updateProductsQuantity(
    product: Product,
    quantity: number,
  ): Promise<void> {
    product.quantity -= quantity;
    this.productRepository.update(product.id, product);
  }

  async findAllOrders(pagination: PaginationOrderDto): Promise<Order[]> {
    return await this.orderRepository.findAll(pagination);
  }

  async findOrdersByUser(
    userId: string,
    pagination: PaginationOrderDto,
  ): Promise<Order[]> {
    const orders = await this.orderRepository.findByUser(userId, pagination);
    if (orders.length === 0) {
      throw new NotFoundException(
        `Orders for user with id ${userId} not found`,
      );
    }
    return orders;
  }

  async totalOrders(status?: string): Promise<number> {
    return await this.orderRepository.totalOrders(status);
  }
}
