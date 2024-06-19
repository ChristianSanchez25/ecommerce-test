import { Test, TestingModule } from '@nestjs/testing';
import { createMockAuthService } from '../../../../../test';
import { UserResponseDto } from '../../../../users/application/dtos';
import { UserRole } from '../../../../users/domain/enums';
import { SERVICE_AUTH } from '../../../domain/constants';
import { ChangePasswordDto } from '../../dtos';
import { IAuthService } from '../../interfaces';
import { ChangePasswordUseCase } from '../change-password.use-case';

describe('ChangePasswordUseCase', () => {
  let useCase: ChangePasswordUseCase;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePasswordUseCase,
        {
          provide: SERVICE_AUTH,
          useValue: createMockAuthService(),
        },
      ],
    }).compile();

    useCase = module.get<ChangePasswordUseCase>(ChangePasswordUseCase);
    authService = module.get<IAuthService>(SERVICE_AUTH);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should change the password and return success message', async () => {
      const user: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        isActive: true,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'avatar.png',
        },
        roles: [UserRole.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };

      authService.changePassword = jest.fn().mockResolvedValue(true);

      const result = await useCase.execute(user, changePasswordDto);

      expect(result).toEqual('Password changed successfully');
      expect(authService.changePassword).toHaveBeenCalledWith(
        user,
        changePasswordDto,
      );
    });

    it('should throw an error if password change fails', async () => {
      const user: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'avatar.png',
        },
        isActive: true,
        roles: [UserRole.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };
      const errorMessage = 'Invalid credentials';
      authService.changePassword = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        useCase.execute(user, changePasswordDto),
      ).rejects.toThrowError(errorMessage);
      expect(authService.changePassword).toHaveBeenCalledWith(
        user,
        changePasswordDto,
      );
    });
  });
});
