import { IUserRepository } from 'src/users/application/interfaces';
import { usersMock } from './user.mock';

export function createMockUserRepository(): IUserRepository {
  return {
    create: jest.fn().mockReturnValue(usersMock[0]),
    findAll: jest.fn().mockReturnValue(usersMock),
    findById: jest.fn((id: string) => {
      return Promise.resolve(usersMock.find((user) => user.id === id));
    }),
    update: jest.fn().mockReturnValue(usersMock[0]),
    totalUsers: jest.fn().mockReturnValue(usersMock.length),
    updatePassword: jest.fn().mockReturnValue(usersMock[0]),
    findByEmail: jest.fn().mockReturnValue(usersMock[0]),
    updateProfile: jest.fn().mockReturnValue(usersMock[0]),
  };
}
