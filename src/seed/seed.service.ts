import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductRepository } from '../products/infrastructure/repositories/product.repository';
import { UserRole } from '../users/domain/enums';
import { UserRepository } from '../users/infrastructure/repositories/user.repository';
import { Products, Users } from './seed';

@Injectable()
export class SeedService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async seed() {
    try {
      for (let i = 0; i < Users.length; i++) {
        const user = await this.userRepository.create(Users[i]);
        // Assign the first user as an admin
        if (i === 0) {
          await this.userRepository.update(user.id, {
            role: [UserRole.ADMIN, ...user.roles],
          });
        }
      }
      for (let i = 0; i < Products.length; i++) {
        await this.productRepository.create(Products[i]);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Error seeding database: ' + error.message,
      );
    }
  }
}
