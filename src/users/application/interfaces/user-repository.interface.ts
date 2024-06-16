import {
  ProfileUserDto,
  RegisterUserDto,
} from '../../../auth/application/dtos';
import { User } from '../../domain/entities';

export interface IUserRepository {
  create(data: RegisterUserDto): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  updateProfile(id: string, data: ProfileUserDto): Promise<User>;
  updatePassword(id: string, password: string): Promise<User>;
  findAll(): Promise<User[]>;
}
