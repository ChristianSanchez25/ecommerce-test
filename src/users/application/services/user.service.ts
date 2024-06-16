import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ILogger, LOGGER_SERVICE } from 'src/common';
import { REPOSITORY_USER } from 'src/users/domain/constants';
import { User } from 'src/users/domain/entities';
import { ProfileDto } from '../dtos';
import { IUserRepository, IUserService } from '../interfaces';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(REPOSITORY_USER) private readonly userRepository: IUserRepository,
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
  ) {}
  changePassword(id: string, password: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn('UserService', `User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.logger.log('UserService', `User with id ${id} found`);
    return user;
  }

  getUsers(): Promise<User[]> {
    const users = this.userRepository.findAll();
    this.logger.log('UserService', 'Users found');
    return users;
  }

  updateProfile(id: string, data: ProfileDto): Promise<User> {
    this.logger.log('UserService', `Update profile for user with id ${id}`);
    return this.userRepository.updateProfile(id, data);
  }
}
