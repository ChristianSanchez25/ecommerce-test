import { IAuthService } from 'src/auth/application/interfaces';
import { usersMock } from '../users/user.mock';

export function createMockAuthService(): IAuthService {
  return {
    login: jest.fn().mockReturnValue({ token: 'token' }),
    register: jest.fn().mockReturnValue(usersMock[0].id),
    renewToken: jest.fn().mockReturnValue('newToken'),
    updateUser: jest.fn().mockReturnValue(usersMock[0]),
    changePassword: jest.fn().mockReturnValue(usersMock[0]),
  };
}
