import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common';
import { ProductsModule } from '../products/products.module';
import { OrderService } from './application/services/order.service';
import {
  CreateOrderUseCase,
  GetOrdersByUserUseCase,
  GetOrdersUseCase,
} from './application/use-cases';
import { REPOSITORY_ORDER, SERVICE_ORDER } from './domain/constants';
import { OrdersController } from './infrastructure/controllers/orders.controller';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { Order } from './infrastructure/schemas';
import { OrderSchema } from './infrastructure/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    AuthModule,
    CommonModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrderRepository,
    CreateOrderUseCase,
    GetOrdersUseCase,
    GetOrdersByUserUseCase,
    {
      provide: REPOSITORY_ORDER,
      useClass: OrderRepository,
    },
    {
      provide: SERVICE_ORDER,
      useClass: OrderService,
    },
  ],
  exports: [
    OrderRepository,
    {
      provide: REPOSITORY_ORDER,
      useClass: OrderRepository,
    },
  ],
})
export class OrdersModule {}
