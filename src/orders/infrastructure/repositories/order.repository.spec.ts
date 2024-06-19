import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderRepository } from './order.repository';

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let orderModel: Model<OrderDocument>;

  const mockOrderModel = {
    exists: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
      ],
    }).compile();

    orderRepository = module.get<OrderRepository>(OrderRepository);
    orderModel = module.get<Model<OrderDocument>>(getModelToken(Order.name));
  });

  it('should be defined', () => {
    expect(orderRepository).toBeDefined();
  });
});
