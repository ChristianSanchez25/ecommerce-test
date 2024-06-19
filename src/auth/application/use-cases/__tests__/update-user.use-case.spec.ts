import { Test, TestingModule } from '@nestjs/testing';
import { createMockAuthService, usersMock } from '../../../../../test';
import { UserMapper } from '../../../../common';
import { UserResponseDto } from '../../../../users/application/dtos';
import { UserRole } from '../../../../users/domain/enums';
import { SERVICE_AUTH } from '../../../domain/constants';
import { UpdateUserDto } from '../../dtos';
import { IAuthService } from '../../interfaces';
import { UpdateUserUseCase } from '../update-user.use-case';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: SERVICE_AUTH,
          useValue: createMockAuthService(),
        },
      ],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    authService = module.get<IAuthService>(SERVICE_AUTH);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a user and return UserResponseDto', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { role: [UserRole.ADMIN] };
      const userResponseDto: UserResponseDto = UserMapper.toDto(usersMock[0]);

      authService.updateUser = jest.fn().mockResolvedValue(usersMock[0]);

      const result = await useCase.execute(userId, updateUserDto);

      expect(result).toEqual(userResponseDto);
      expect(authService.updateUser).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
    });

    it('should throw an error if update fails', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { role: [UserRole.ADMIN] };
      const errorMessage = 'User not found';
      authService.updateUser = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await expect(useCase.execute(userId, updateUserDto)).rejects.toThrowError(
        errorMessage,
      );
      expect(authService.updateUser).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
    });
  });
});
