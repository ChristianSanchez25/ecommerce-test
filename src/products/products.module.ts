import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common';
import { ProductService } from './application/services/product.service';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductUseCase,
  GetProductsUseCase,
  UpdateProductUseCase,
} from './application/use-cases';
import { REPOSITORY_PRODUCT, SERVICE_PRODUCT } from './domain/constants';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import {
  Product,
  ProductSchema,
} from './infrastructure/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    AuthModule,
    CommonModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductRepository,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    GetProductUseCase,
    GetProductsUseCase,
    {
      provide: REPOSITORY_PRODUCT,
      useClass: ProductRepository,
    },
    {
      provide: SERVICE_PRODUCT,
      useClass: ProductService,
    },
  ],
  exports: [
    ProductRepository,
    {
      provide: REPOSITORY_PRODUCT,
      useClass: ProductRepository,
    },
  ],
})
export class ProductsModule {}
