import { User } from 'src/users/domain/entities';
import { PaginationDto } from '../../../common';
import { UpdateProfileDto } from '../dtos';

export interface IUserService {
  getUserById(id: string): Promise<User>;
  getUsers(pagination: PaginationDto): Promise<User[]>;
  getTotalUsers(): Promise<number>;
  updateProfile(id: string, data: UpdateProfileDto): Promise<User>;
}
