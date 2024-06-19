import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  createMockLogger,
  createMockUserRepository,
  usersMock,
} from '../../../../test';
import { ILogger, LOGGER_SERVICE, PaginationDto } from '../../../common';
import { REPOSITORY_USER } from '../../domain/constants';
import { User } from '../../domain/entities';
import { UpdateProfileDto } from '../dtos';
import { IUserRepository } from '../interfaces';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: IUserRepository;
  let logger: ILogger;
  const userExpected: User = usersMock[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: REPOSITORY_USER,
          useValue: createMockUserRepository(),
        },
        {
          provide: LOGGER_SERVICE,
          useValue: createMockLogger(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(REPOSITORY_USER);
    logger = module.get(LOGGER_SERVICE);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const result = await userService.getUserById('1');
      expect(result).toEqual(userExpected);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(logger.log).toHaveBeenCalledWith(
        'UserService',
        'User with id 1 found',
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(userService.getUserById('NOT_FOUND')).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith('NOT_FOUND');
      expect(logger.warn).toHaveBeenCalledWith(
        'UserService',
        'User with id NOT_FOUND not found',
      );
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const result = await userService.getUsers(paginationDto);
      expect(result).toEqual(usersMock);
      expect(userRepository.findAll).toHaveBeenCalledWith(paginationDto);
      expect(logger.log).toHaveBeenCalledWith(
        'UserService',
        `Found ${usersMock.length} users`,
      );
    });
  });

  describe('getTotalUsers', () => {
    it('should return the total number of users', async () => {
      const result = await userService.getTotalUsers();
      expect(result).toEqual(usersMock.length);
      expect(userRepository.totalUsers).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        'UserService',
        `Found ${usersMock.length} users`,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const updatedUser: User = {
        ...userExpected,
        profile: {
          ...userExpected.profile,
          ...updateProfileDto,
          fullName: 'John Doe',
        },
      };
      jest
        .spyOn(userRepository, 'updateProfile')
        .mockResolvedValue(updatedUser);

      const result = await userService.updateProfile('1', updateProfileDto);
      expect(result).toEqual(updatedUser);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(userRepository.updateProfile).toHaveBeenCalledWith('1', {
        ...userExpected.profile,
        ...updateProfileDto,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(
        userService.updateProfile('NOT_FOUND', {
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findById).toHaveBeenCalledWith('NOT_FOUND');
      expect(logger.warn).toHaveBeenCalledWith(
        'UserService',
        'User with id NOT_FOUND not found',
      );
    });
  });
});
