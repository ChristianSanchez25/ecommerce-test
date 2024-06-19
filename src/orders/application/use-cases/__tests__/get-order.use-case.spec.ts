import { Test, TestingModule } from '@nestjs/testing';
import { createOrderServiceMock, ordersMock } from '../../../../../test';
import { IOrderService } from '../../../application/interfaces';
import { SERVICE_ORDER } from '../../../domain/constants';
import { GetOrderUseCase } from '../get-order.use-case';

describe('GetOrderUseCase', () => {
  let useCase: GetOrderUseCase;
  let orderService: IOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrderUseCase,
        {
          provide: SERVICE_ORDER,
          useValue: createOrderServiceMock(),
        },
      ],
    }).compile();

    useCase = module.get<GetOrderUseCase>(GetOrderUseCase);
    orderService = module.get<IOrderService>(SERVICE_ORDER);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return an order by id', async () => {
      const orderId = '1';
      const expectedOrderResponse = ordersMock[0];

      orderService.findOrderById = jest
        .fn()
        .mockResolvedValue(expectedOrderResponse);

      const result = await useCase.execute(orderId);

      expect(result).toEqual(expectedOrderResponse);
      expect(orderService.findOrderById).toHaveBeenCalledWith(orderId);
    });

    it('should throw an error if order not found', async () => {
      const orderId = '2';
      const errorMessage = `Order with id ${orderId} not found`;

      orderService.findOrderById = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      try {
        await useCase.execute(orderId);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
