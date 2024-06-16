import { User } from 'src/users/domain/entities';
import { ProfileDto } from '../dtos';

export interface IUserService {
  getUserById(id: string): Promise<User>;
  getUsers(): Promise<User[]>;
  updateProfile(id: string, data: ProfileDto): Promise<User>;
}
