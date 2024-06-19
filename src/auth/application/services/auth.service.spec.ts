import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  createMockEncryptService,
  createMockJwtService,
  createMockLogger,
  createMockUserRepository,
  usersMock,
} from '../../../../test';
import { ILogger, LOGGER_SERVICE } from '../../../common';
import { UserResponseDto } from '../../../users/application/dtos';
import { IUserRepository } from '../../../users/application/interfaces';
import { REPOSITORY_USER } from '../../../users/domain/constants';
import { User } from '../../../users/domain/entities';
import { UserRole } from '../../../users/domain/enums';
import { ENCRYPT, JWT } from '../../domain/constants';
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from '../dtos';
import { IEncrypt, IJwtService } from '../interfaces';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: IUserRepository;
  let logger: ILogger;
  let jwtService: IJwtService;
  let bcrypt: IEncrypt;
  const userExpected: User = usersMock[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: REPOSITORY_USER,
          useValue: createMockUserRepository(),
        },
        {
          provide: LOGGER_SERVICE,
          useValue: createMockLogger(),
        },
        {
          provide: JWT,
          useValue: createMockJwtService(),
        },
        {
          provide: ENCRYPT,
          useValue: createMockEncryptService(),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(REPOSITORY_USER);
    logger = module.get(LOGGER_SERVICE);
    jwtService = module.get(JWT);
    bcrypt = module.get(ENCRYPT);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'avatar.png',
        },
      };
      userRepository.findByEmail = jest.fn().mockResolvedValue(null);
      userRepository.create = jest.fn().mockResolvedValue(userExpected);
      bcrypt.encrypt = jest.fn().mockReturnValue('hashedPassword');

      const result = await authService.register(registerUserDto);

      expect(result).toEqual(userExpected);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        registerUserDto.email,
      );
      expect(logger.log).toHaveBeenCalledWith(
        'AuthService',
        `User ${userExpected.email} created`,
      );
      expect(userRepository.create).toHaveBeenCalledWith({
        ...registerUserDto,
        password: 'hashedPassword',
      });
    });

    it('should throw an error if user already exists', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'avatar.png',
        },
      };
      userRepository.findByEmail = jest.fn().mockResolvedValue(userExpected);

      await expect(authService.register(registerUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        registerUserDto.email,
      );
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      userRepository.findByEmail = jest.fn().mockResolvedValue(userExpected);
      bcrypt.compare = jest.fn().mockReturnValue(true);
      jwtService.signAsync = jest.fn().mockResolvedValue('token');

      const result = await authService.login(loginUserDto);

      expect(result).toEqual({ token: 'token' });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        loginUserDto.email,
      );
      expect(logger.log).toHaveBeenCalledWith(
        'AuthService',
        `User ${userExpected.email} logged in`,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginUserDto.password,
        userExpected.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: userExpected.id,
      });
    });

    it('should throw an error if email is invalid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'invalid@example.com',
        password: 'password123',
      };
      userRepository.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        loginUserDto.email,
      );
    });

    it('should throw an error if password is invalid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'invalidPassword',
      };
      userRepository.findByEmail = jest.fn().mockResolvedValue(userExpected);
      bcrypt.compare = jest.fn().mockReturnValue(false);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        loginUserDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginUserDto.password,
        userExpected.password,
      );
    });
  });

  describe('renewToken', () => {
    it('should renew a token for a user', async () => {
      const email = 'test@example.com';
      userRepository.findByEmail = jest.fn().mockResolvedValue(userExpected);
      jwtService.signAsync = jest.fn().mockResolvedValue('newToken');

      const result = await authService.renewToken(email);

      expect(result).toEqual({ token: 'newToken' });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: userExpected.id,
      });
    });

    it('should throw an error if email is invalid', async () => {
      const email = 'invalid@example.com';
      userRepository.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(authService.renewToken(email)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });
  describe('changePassword', () => {
    it('should change the password of a user', async () => {
      const userDto: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        isActive: true,
        roles: [UserRole.USER],
        profile: { firstName: 'John', lastName: 'Doe', avatar: 'avatar.png' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };
      userRepository.findById = jest.fn().mockResolvedValue(userExpected);
      bcrypt.compare = jest.fn().mockReturnValue(true);
      bcrypt.encrypt = jest.fn().mockReturnValue('hashedNewPassword');
      userRepository.updatePassword = jest.fn().mockResolvedValue(userExpected);

      const result = await authService.changePassword(
        userDto,
        changePasswordDto,
      );

      expect(result).toBe(true);
      expect(userRepository.findById).toHaveBeenCalledWith(userDto.id);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        changePasswordDto.oldPassword,
        userExpected.password,
      );
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        userDto.id,
        'hashedNewPassword',
      );
    });

    it('should throw an error if user is not found', async () => {
      const userDto: UserResponseDto = {
        id: '2',
        email: 'invalid@example.com',
        isActive: true,
        roles: [UserRole.USER],
        profile: { firstName: 'John', lastName: 'Doe', avatar: 'avatar.png' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };
      userRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(
        authService.changePassword(userDto, changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith(userDto.id);
    });

    it('should throw an error if old password is invalid', async () => {
      const userDto: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        isActive: true,
        roles: [UserRole.USER],
        profile: { firstName: 'John', lastName: 'Doe', avatar: 'avatar.png' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'invalidOldPassword',
        newPassword: 'newPassword123',
      };
      userRepository.findById = jest.fn().mockResolvedValue(userExpected);
      bcrypt.compare = jest.fn().mockReturnValue(false);

      await expect(
        authService.changePassword(userDto, changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith(userDto.id);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        changePasswordDto.oldPassword,
        userExpected.password,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { role: [UserRole.ADMIN] };
      userRepository.findById = jest.fn().mockResolvedValue(userExpected);
      userRepository.update = jest.fn().mockResolvedValue(userExpected);

      const result = await authService.updateUser(userId, updateUserDto);

      expect(result).toEqual(userExpected);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        ...updateUserDto,
        role: [...updateUserDto.role],
      });
    });

    it('should throw an error if user is not found', async () => {
      const userId = '2';
      const updateUserDto: UpdateUserDto = { role: [UserRole.ADMIN] };
      userRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(
        authService.updateUser(userId, updateUserDto),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });
});
