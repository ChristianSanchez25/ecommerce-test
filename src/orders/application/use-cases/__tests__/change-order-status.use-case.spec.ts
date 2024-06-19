import { Test, TestingModule } from '@nestjs/testing';
import { createOrderServiceMock, ordersMock } from '../../../../../test';
import { ChangeOrderStatusDto } from '../../../application/dtos';
import { IOrderService } from '../../../application/interfaces';
import { SERVICE_ORDER } from '../../../domain/constants';
import { OrderStatus } from '../../../domain/enums';
import { ChangeOrderStatusUseCase } from '../change-order-status.use-case';

describe('ChangeOrderStatusUseCase', () => {
  let useCase: ChangeOrderStatusUseCase;
  let orderService: IOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeOrderStatusUseCase,
        {
          provide: SERVICE_ORDER,
          useValue: createOrderServiceMock(),
        },
      ],
    }).compile();

    useCase = module.get<ChangeOrderStatusUseCase>(ChangeOrderStatusUseCase);
    orderService = module.get<IOrderService>(SERVICE_ORDER);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should change the order status successfully', async () => {
      const orderId = '1';
      const changeOrderStatusDto: ChangeOrderStatusDto = {
        status: OrderStatus.COMPLETED,
      };
      const expectedOrderResponse = {
        ...ordersMock[0],
        status: 'COMPLETED',
      };

      orderService.updateOrderStatus = jest
        .fn()
        .mockResolvedValue(expectedOrderResponse);

      const result = await useCase.execute(orderId, changeOrderStatusDto);

      expect(result).toEqual(expectedOrderResponse);
      expect(orderService.updateOrderStatus).toHaveBeenCalledWith(
        orderId,
        changeOrderStatusDto.status,
      );
    });

    it('should throw an error if order status update fails', async () => {
      const orderId = '1';
      const changeOrderStatusDto: ChangeOrderStatusDto = {
        status: OrderStatus.COMPLETED,
      };
      const errorMessage = 'Order status update failed';

      orderService.updateOrderStatus = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      try {
        await useCase.execute(orderId, changeOrderStatusDto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
