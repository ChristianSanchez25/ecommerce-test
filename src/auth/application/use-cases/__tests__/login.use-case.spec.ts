import { Test, TestingModule } from '@nestjs/testing';
import { createMockAuthService } from '../../../../../test';
import { SERVICE_AUTH } from '../../../domain/constants';
import { LoginResponseDto, LoginUserDto } from '../../dtos';
import { IAuthService } from '../../interfaces';
import { LoginUseCase } from '../login.use-case';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: SERVICE_AUTH,
          useValue: createMockAuthService(),
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    authService = module.get<IAuthService>(SERVICE_AUTH);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should login a user and return LoginResponseDto', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResponse: LoginResponseDto = { token: 'token' };

      authService.login = jest.fn().mockResolvedValue(expectedResponse);

      const result = await useCase.execute(loginUserDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });

    it('should throw an error if login fails', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const errorMessage = 'Invalid credentials';
      authService.login = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(useCase.execute(loginUserDto)).rejects.toThrowError(
        errorMessage,
      );
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });
});
