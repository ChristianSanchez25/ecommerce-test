import { Test, TestingModule } from '@nestjs/testing';
import { createOrderServiceMock, ordersMock } from '../../../../../test';
import { IOrderService } from '../../../application/interfaces';
import { SERVICE_ORDER } from '../../../domain/constants';
import { OrderStatus } from '../../../domain/enums';
import { ListOrderResponseDto, PaginationOrderDto } from '../../dtos';
import { GetOrdersUseCase } from '../get-orders.use-case';

describe('GetOrdersUseCase', () => {
  let useCase: GetOrdersUseCase;
  let orderService: IOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrdersUseCase,
        {
          provide: SERVICE_ORDER,
          useValue: createOrderServiceMock(),
        },
      ],
    }).compile();

    useCase = module.get<GetOrdersUseCase>(GetOrdersUseCase);
    orderService = module.get<IOrderService>(SERVICE_ORDER);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a list of orders with metadata', async () => {
      const pagination: PaginationOrderDto = {
        page: 1,
        limit: 10,
        status: OrderStatus.COMPLETED,
      };
      const expectedOrders = ordersMock;
      const totalOrders = ordersMock.length;

      orderService.findAllOrders = jest.fn().mockResolvedValue(expectedOrders);
      orderService.totalOrders = jest.fn().mockResolvedValue(totalOrders);

      const result: ListOrderResponseDto = await useCase.execute(pagination);

      expect(result.orders).toEqual(expectedOrders);
      expect(result.metadata.total).toEqual(totalOrders);
      expect(result.metadata.page).toEqual(pagination.page);
      expect(result.metadata.lastPage).toEqual(
        Math.ceil(totalOrders / pagination.limit),
      );
      expect(orderService.findAllOrders).toHaveBeenCalledWith(pagination);
      expect(orderService.totalOrders).toHaveBeenCalledWith('COMPLETED');
    });

    it('should throw an error if orders cannot be fetched', async () => {
      const pagination: PaginationOrderDto = {
        page: 1,
        limit: 10,
        status: OrderStatus.COMPLETED,
      };
      const errorMessage = 'Error fetching orders';

      orderService.findAllOrders = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      try {
        await useCase.execute(pagination);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
