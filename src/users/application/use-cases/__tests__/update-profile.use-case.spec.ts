import { Test, TestingModule } from '@nestjs/testing';
import { createMockUserService, usersMock } from '../../../../../test';
import { UserMapper } from '../../../../common';
import { SERVICE_USER } from '../../../domain/constants';
import { User } from '../../../domain/entities';
import { UpdateProfileDto, UserResponseDto } from '../../dtos';
import { IUserService } from '../../interfaces';
import { UpdateProfileUserUseCase } from '../update-profile-user.use-case';

describe('UpdateProfileUserUseCase', () => {
  let useCase: UpdateProfileUserUseCase;
  let userService: IUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProfileUserUseCase,
        {
          provide: SERVICE_USER,
          useValue: createMockUserService(),
        },
      ],
    }).compile();

    useCase = module.get<UpdateProfileUserUseCase>(UpdateProfileUserUseCase);
    userService = module.get<IUserService>(SERVICE_USER);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a user profile and return a user response dto', async () => {
      const userId = '1';
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const updatedUser: User = {
        ...usersMock[0],
        profile: {
          ...usersMock[0].profile,
          ...updateProfileDto,
          fullName: 'John Doe',
        },
      };
      const userResponseDto: UserResponseDto = UserMapper.toDto(updatedUser);

      userService.updateProfile = jest.fn().mockResolvedValue(updatedUser);

      const result = await useCase.execute(userId, updateProfileDto);

      expect(result).toEqual(userResponseDto);
      expect(userService.updateProfile).toHaveBeenCalledWith(
        userId,
        updateProfileDto,
      );
    });
  });
});
