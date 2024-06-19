import { IEncrypt } from '../../../src/auth/application/interfaces';

export function createMockEncryptService(): IEncrypt {
  return {
    compare: jest.fn().mockReturnValue(true),
    encrypt: jest.fn().mockReturnValue('hash'),
  };
}
