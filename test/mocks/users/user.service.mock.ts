import { IUserService } from 'src/users/application/interfaces';
import { usersMock } from './user.mock';

export function createMockUserService(): IUserService {
  return {
    getUserById: jest.fn((id: string) => {
      return Promise.resolve(usersMock.find((user) => user.id === id));
    }),
    getUsers: jest.fn().mockReturnValue(usersMock),
    getTotalUsers: jest.fn().mockReturnValue(usersMock.length),
    updateProfile: jest.fn().mockReturnValue(usersMock[0]),
  };
}
