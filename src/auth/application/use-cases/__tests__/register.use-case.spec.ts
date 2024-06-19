import { Test, TestingModule } from '@nestjs/testing';
import { createMockAuthService, usersMock } from '../../../../../test';
import { SERVICE_AUTH } from '../../../domain/constants';
import { RegisterResponseDto, RegisterUserDto } from '../../dtos';
import { IAuthService } from '../../interfaces';
import { RegisterUseCase } from '../register.use-case';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        {
          provide: SERVICE_AUTH,
          useValue: createMockAuthService(),
        },
      ],
    }).compile();

    useCase = module.get<RegisterUseCase>(RegisterUseCase);
    authService = module.get<IAuthService>(SERVICE_AUTH);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should register a user and return RegisterResponseDto', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'avatar.png',
        },
      };
      const expectedResponse: RegisterResponseDto = { id: usersMock[0].id };

      authService.register = jest.fn().mockResolvedValue(usersMock[0]);

      const result = await useCase.execute(registerUserDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.register).toHaveBeenCalledWith(registerUserDto);
    });

    it('should throw an error if registration fails', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'avatar.png',
        },
      };
      const errorMessage = 'User with email test@example.com already exists';

      authService.register = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      try {
        await useCase.execute(registerUserDto);
      } catch (error) {
        expect(error.message).toEqual(errorMessage);
      }
    });
  });
});
