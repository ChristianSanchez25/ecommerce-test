import { IJwtService } from '../../../src/auth/application/interfaces';

export function createMockJwtService(): IJwtService {
  return {
    signAsync: jest.fn().mockReturnValue('token'),
    verifyAsync: jest.fn().mockReturnValue({ id: '1' }),
  };
}
