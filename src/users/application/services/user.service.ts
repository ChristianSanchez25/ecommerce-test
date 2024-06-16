import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ILogger, LOGGER_SERVICE, PaginationDto } from 'src/common';
import { REPOSITORY_USER } from 'src/users/domain/constants';
import { User } from 'src/users/domain/entities';
import { UpdateProfileDto } from '../dtos';
import { IUserRepository, IUserService } from '../interfaces';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(REPOSITORY_USER) private readonly userRepository: IUserRepository,
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn('UserService', `User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.logger.log('UserService', `User with id ${id} found`);
    return user;
  }

  async getUsers(pagination: PaginationDto): Promise<User[]> {
    const users = await this.userRepository.findAll(pagination);
    this.logger.log('UserService', `Found ${users.length} users`);
    return users;
  }

  async getTotalUsers(): Promise<number> {
    const total = await this.userRepository.totalUsers();
    this.logger.log('UserService', `Found ${total} users`);
    return total;
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn('UserService', `User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return await this.userRepository.updateProfile(id, {
      ...user.profile,
      ...data,
    });
  }
}
