import { RegisterUserDto, UpdateUserDto } from '../../../auth/application/dtos';
import { PaginationDto } from '../../../common';
import { User } from '../../domain/entities';
import { UpdateProfileDto } from '../dtos';

export interface IUserRepository {
  create(data: RegisterUserDto): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  updateProfile(id: string, data: UpdateProfileDto): Promise<User>;
  updatePassword(id: string, password: string): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  findAll(pagination: PaginationDto): Promise<User[]>;
  totalUsers(): Promise<number>;
}
