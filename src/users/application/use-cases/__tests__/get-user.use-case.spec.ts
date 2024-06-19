import { Test, TestingModule } from '@nestjs/testing';
import { createMockUserService, usersMock } from '../../../../../test';
import { UserMapper } from '../../../../common';
import { SERVICE_USER } from '../../../domain/constants';
import { UserResponseDto } from '../../dtos';
import { IUserService } from '../../interfaces';
import { GetUserUseCase } from '../get-user.use-case';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let userService: IUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        {
          provide: SERVICE_USER,
          useValue: createMockUserService(),
        },
      ],
    }).compile();

    useCase = module.get<GetUserUseCase>(GetUserUseCase);
    userService = module.get<IUserService>(SERVICE_USER);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a user response dto', async () => {
      const userId = '1';
      const user = usersMock[0];
      const userResponseDto: UserResponseDto = UserMapper.toDto(user);

      userService.getUserById = jest.fn().mockResolvedValue(user);

      const result = await useCase.execute(userId);

      expect(result).toEqual(userResponseDto);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
    });
  });
});
