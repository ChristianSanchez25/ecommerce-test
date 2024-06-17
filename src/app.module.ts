import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common';
import { MongoModule } from './persistences/mongo.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, CommonModule, UsersModule, MongoModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
