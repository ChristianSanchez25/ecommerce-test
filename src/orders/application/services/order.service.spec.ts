import { Test, TestingModule } from '@nestjs/testing';
import {
  createMockLogger,
  createMockProductRepository,
  createOrderRepositoryMock,
  ordersMock,
  productsMock,
} from '../../../../test';
import { IProductRepository } from '../../../products/application/interfaces';
import { REPOSITORY_PRODUCT } from '../../../products/domain/constants';
import { REPOSITORY_ORDER } from '../../domain/constants';
import { OrderStatus } from '../../domain/enums';
import { CreateOrderDto, PaginationOrderDto } from '../dtos';
import { IOrderRepository } from '../interfaces';
import { ILogger, LOGGER_SERVICE } from './../../../common';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let orderService: OrderService;
  let productRepository: IProductRepository;
  let orderRepository: IOrderRepository;
  let logger: ILogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: REPOSITORY_PRODUCT,
          useValue: createMockProductRepository(),
        },
        {
          provide: REPOSITORY_ORDER,
          useValue: createOrderRepositoryMock(),
        },
        {
          provide: LOGGER_SERVICE,
          useValue: createMockLogger(),
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    productRepository = module.get<IProductRepository>(REPOSITORY_PRODUCT);
    orderRepository = module.get<IOrderRepository>(REPOSITORY_ORDER);
    logger = module.get<ILogger>(LOGGER_SERVICE);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ productId: '1', quantity: 2, price: 50 }],
      };
      const userId = '1';

      productRepository.validateProducts = jest
        .fn()
        .mockResolvedValue(productsMock);
      orderRepository.createOrder = jest.fn().mockResolvedValue(ordersMock[0]);

      const result = await orderService.createOrder(createOrderDto, userId);

      expect(result).toEqual(ordersMock[0]);
      expect(productRepository.validateProducts).toHaveBeenCalledWith(['1']);
      expect(orderRepository.createOrder).toHaveBeenCalled();
    });

    it('should throw an error if there are duplicate products in the order', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          { productId: '1', quantity: 2, price: 50 },
          { productId: '1', quantity: 3, price: 50 },
        ],
      };
      const userId = '1';

      try {
        await orderService.createOrder(createOrderDto, userId);
      } catch (error) {
        expect(logger.warn).toHaveBeenCalledWith(
          'OrderService',
          'Duplicate products in order creation',
        );
        expect(error.message).toEqual('Duplicate products in order creation');
      }
    });

    describe('findOrderById', () => {
      it('should return an order by id', async () => {
        orderRepository.findById = jest.fn().mockResolvedValue(ordersMock[0]);

        const result = await orderService.findOrderById('1');

        expect(result).toEqual(ordersMock[0]);
        expect(orderRepository.findById).toHaveBeenCalledWith('1');
      });

      it('should throw an error if order not found', async () => {
        orderRepository.findById = jest.fn().mockResolvedValue(null);

        try {
          await orderService.findOrderById('1');
        } catch (error) {
          expect(error.message).toEqual('Order with id 1 not found');
        }
      });
    });

    describe('findAllOrders', () => {
      it('should return all orders', async () => {
        orderRepository.findAll = jest.fn().mockResolvedValue(ordersMock);
        const pagination: PaginationOrderDto = {
          limit: 10,
          page: 1,
          status: OrderStatus.PENDING,
        };

        const result = await orderService.findAllOrders(pagination);

        expect(result).toEqual(ordersMock);
        expect(orderRepository.findAll).toHaveBeenCalledWith(pagination);
      });
    });

    describe('findOrdersByUser', () => {
      it('should return orders for a user', async () => {
        orderRepository.findByUser = jest.fn().mockResolvedValue(ordersMock);
        const userId = '1';
        const pagination: PaginationOrderDto = {
          limit: 10,
          page: 1,
          status: OrderStatus.PENDING,
        };

        const result = await orderService.findOrdersByUser(userId, pagination);

        expect(result).toEqual(ordersMock);
        expect(orderRepository.findByUser).toHaveBeenCalledWith(
          userId,
          pagination,
        );
      });

      it('should throw an error if no orders found for user', async () => {
        orderRepository.findByUser = jest.fn().mockResolvedValue([]);

        try {
          await orderService.findOrdersByUser('1', {
            limit: 10,
            page: 1,
            status: OrderStatus.PENDING,
          });
        } catch (error) {
          expect(error.message).toEqual('Orders for user with id 1 not found');
        }
      });
    });

    describe('updateOrderStatus', () => {
      it('should update the order status successfully', async () => {
        const orderId = '1';
        const newStatus = OrderStatus.COMPLETED;

        orderRepository.findById = jest.fn().mockResolvedValue(ordersMock[0]);
        orderRepository.updateStatus = jest.fn().mockResolvedValue({
          ...ordersMock[0],
          status: newStatus,
        });

        const result = await orderService.updateOrderStatus(orderId, newStatus);

        expect(result.status).toEqual(newStatus);
        expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
        expect(orderRepository.updateStatus).toHaveBeenCalledWith(
          orderId,
          newStatus,
        );
      });

      it('should throw an error if the order already has the same status', async () => {
        const orderId = '1';
        const newStatus = OrderStatus.PENDING;

        orderRepository.findById = jest.fn().mockResolvedValue(ordersMock[0]);

        try {
          await orderService.updateOrderStatus(orderId, newStatus);
        } catch (error) {
          expect(error.message).toEqual(
            `Order with id ${orderId} already has status ${newStatus}`,
          );
        }
      });

      it('should throw an error if the order is already cancelled', async () => {
        const orderId = '1';
        const newStatus = OrderStatus.COMPLETED;

        orderRepository.findById = jest.fn().mockResolvedValue({
          ...ordersMock[0],
          status: 'CANCELLED',
        });

        try {
          await orderService.updateOrderStatus(orderId, newStatus);
        } catch (error) {
          expect(error.message).toEqual(
            `Order with id ${orderId} has status CANCELLED and cannot be updated`,
          );
        }
      });
    });

    describe('totalOrders', () => {
      it('should return the total number of orders', async () => {
        orderRepository.totalOrders = jest
          .fn()
          .mockResolvedValue(ordersMock.length);

        const result = await orderService.totalOrders();

        expect(result).toEqual(ordersMock.length);
        expect(orderRepository.totalOrders).toHaveBeenCalled();
      });
    });
  });
});
