import { Test, TestingModule } from '@nestjs/testing';
import { createOrderServiceMock, ordersMock } from '../../../../../test';
import { CreateOrderDto } from '../../../application/dtos';
import { IOrderService } from '../../../application/interfaces';
import { SERVICE_ORDER } from '../../../domain/constants';
import { CreateOrderUseCase } from '../create-order.use-case';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderService: IOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        {
          provide: SERVICE_ORDER,
          useValue: createOrderServiceMock(),
        },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderService = module.get<IOrderService>(SERVICE_ORDER);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ productId: '1', quantity: 2, price: 50 }],
      };
      const userId = '1';
      const expectedOrderResponse = ordersMock[0];

      orderService.createOrder = jest
        .fn()
        .mockResolvedValue(expectedOrderResponse);

      const result = await useCase.execute(createOrderDto, userId);

      expect(result).toEqual(expectedOrderResponse);
      expect(orderService.createOrder).toHaveBeenCalledWith(
        createOrderDto,
        userId,
      );
    });

    it('should throw an error if order creation fails', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ productId: '1', quantity: 2, price: 50 }],
      };
      const userId = '1';
      const errorMessage = 'Order creation failed';

      orderService.createOrder = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      try {
        await useCase.execute(createOrderDto, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
