import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
