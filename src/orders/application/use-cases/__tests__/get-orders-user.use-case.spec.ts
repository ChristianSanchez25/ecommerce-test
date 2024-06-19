import { Test, TestingModule } from '@nestjs/testing';
import { createOrderServiceMock, ordersMock } from '../../../../../test';
import { IOrderService } from '../../../application/interfaces';
import { SERVICE_ORDER } from '../../../domain/constants';
import { OrderStatus } from '../../../domain/enums';
import { PaginationOrderDto } from '../../dtos';
import { GetOrdersByUserUseCase } from '../get-orders-user.use.case';

describe('GetOrdersByUserUseCase', () => {
  let useCase: GetOrdersByUserUseCase;
  let orderService: IOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrdersByUserUseCase,
        {
          provide: SERVICE_ORDER,
          useValue: createOrderServiceMock(),
        },
      ],
    }).compile();

    useCase = module.get<GetOrdersByUserUseCase>(GetOrdersByUserUseCase);
    orderService = module.get<IOrderService>(SERVICE_ORDER);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return orders for a user', async () => {
      const userId = '1';
      const pagination: PaginationOrderDto = {
        page: 1,
        limit: 10,
        status: OrderStatus.COMPLETED,
      };
      const expectedOrders = ordersMock;

      orderService.findOrdersByUser = jest
        .fn()
        .mockResolvedValue(expectedOrders);

      const result = await useCase.execute(userId, pagination);

      expect(result).toEqual(expectedOrders);
      expect(orderService.findOrdersByUser).toHaveBeenCalledWith(
        userId,
        pagination,
      );
    });

    it('should throw an error if no orders found for user', async () => {
      const userId = '2';
      const pagination: PaginationOrderDto = {
        page: 1,
        limit: 10,
        status: OrderStatus.COMPLETED,
      };
      const errorMessage = `Orders for user with id ${userId} not found`;

      orderService.findOrdersByUser = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      try {
        await useCase.execute(userId, pagination);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
