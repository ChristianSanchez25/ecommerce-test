import { Test, TestingModule } from '@nestjs/testing';
import { createMockAuthService } from '../../../../../test';
import { SERVICE_AUTH } from '../../../domain/constants';
import { LoginResponseDto } from '../../dtos';
import { IAuthService } from '../../interfaces';
import { RenewUseCase } from '../renew-token.use-case';

describe('RenewUseCase', () => {
  let useCase: RenewUseCase;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RenewUseCase,
        {
          provide: SERVICE_AUTH,
          useValue: createMockAuthService(),
        },
      ],
    }).compile();

    useCase = module.get<RenewUseCase>(RenewUseCase);
    authService = module.get<IAuthService>(SERVICE_AUTH);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should renew a token for a user and return LoginResponseDto', async () => {
      const email = 'test@example.com';
      const expectedResponse: LoginResponseDto = { token: 'newToken' };

      authService.renewToken = jest.fn().mockResolvedValue(expectedResponse);

      const result = await useCase.execute(email);

      expect(result).toEqual(expectedResponse);
      expect(authService.renewToken).toHaveBeenCalledWith(email);
    });

    it('should throw an error if renewal fails', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Invalid credentials';
      authService.renewToken = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await expect(useCase.execute(email)).rejects.toThrowError(errorMessage);
      expect(authService.renewToken).toHaveBeenCalledWith(email);
    });
  });
});
