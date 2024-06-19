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
import { CreateOrderDto, OrderResponseDto, PaginationOrderDto } from '../dtos';
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
  ): Promise<OrderResponseDto> {
    const productsIds = createOrder.items.map((item) => item.productId);
    const productsIdsSet = new Set(productsIds);
    if (productsIds.length !== productsIdsSet.size) {
      this.logger.warn('OrderService', 'Duplicate products in order creation');
      throw new BadRequestException('Duplicate products in order creation');
    }
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

    await this.decreaseProductsQuantities(createOrder.items, productsMap);

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

  async findOrderById(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async findAllOrders(
    pagination: PaginationOrderDto,
  ): Promise<OrderResponseDto[]> {
    return await this.orderRepository.findAll(pagination);
  }

  async findOrdersByUser(
    userId: string,
    pagination: PaginationOrderDto,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByUser(userId, pagination);
    if (orders.length === 0) {
      throw new NotFoundException(
        `Orders for user with id ${userId} not found`,
      );
    }
    return orders;
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderResponseDto> {
    const order = await this.findOrderById(id);
    const previousStatus = order.status;
    if (previousStatus === status) {
      this.logger.warn(
        'OrderService',
        `Order with id ${id} already has status ${status}`,
      );
      throw new BadRequestException(
        `Order with id ${id} already has status ${status}`,
      );
    }
    if (previousStatus === OrderStatus.CANCELLED) {
      this.logger.warn(
        'OrderService',
        `Order with id ${id} has status CANCELLED and cannot be updated`,
      );
      throw new BadRequestException(
        `Order with id ${id} has status CANCELLED and cannot be updated`,
      );
    }
    const updatedOrder = await this.orderRepository.updateStatus(id, status);

    if (status === OrderStatus.CANCELLED) {
      await this.increaseProductsQuantities(updatedOrder.items);
    }
    this.logger.log(
      'OrderService',
      `Order with id ${id} updated to status ${status}`,
    );
    return updatedOrder;
  }

  async totalOrders(status?: string): Promise<number> {
    return await this.orderRepository.totalOrders(status);
  }

  private async updateProductQuantity(
    product: Product,
    quantity: number,
  ): Promise<void> {
    product.quantity += quantity;
    await this.productRepository.update(product.id, product);
  }

  private async decreaseProductsQuantities(
    items: Array<{ productId: string; quantity: number }>,
    productsMap: Map<string, Product>,
  ): Promise<void> {
    for (const item of items) {
      let product = productsMap.get(item.productId);
      await this.updateProductQuantity(product, -item.quantity);
    }
  }

  private async increaseProductsQuantities(
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<void> {
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        await this.updateProductQuantity(product, item.quantity);
      }
    }
  }
}
