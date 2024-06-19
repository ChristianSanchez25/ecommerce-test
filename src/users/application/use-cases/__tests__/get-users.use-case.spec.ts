import { Test, TestingModule } from '@nestjs/testing';
import { createMockUserService, usersMock } from '../../../../../test';
import { PaginationDto, UserMapper } from '../../../../common';
import { SERVICE_USER } from '../../../domain/constants';
import { ListUserResponseDto } from '../../dtos';
import { IUserService } from '../../interfaces';
import { GetUsersUseCase } from '../get-users.use-case';

describe('GetUsersUseCase', () => {
  let useCase: GetUsersUseCase;
  let userService: IUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersUseCase,
        {
          provide: SERVICE_USER,
          useValue: createMockUserService(),
        },
      ],
    }).compile();

    useCase = module.get<GetUsersUseCase>(GetUsersUseCase);
    userService = module.get<IUserService>(SERVICE_USER);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a list of users with metadata', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const totalUsers = usersMock.length;

      userService.getUsers = jest.fn().mockResolvedValue(usersMock);
      userService.getTotalUsers = jest.fn().mockResolvedValue(totalUsers);

      const expectedResponse: ListUserResponseDto = {
        users: usersMock.map((user) => UserMapper.toDto(user)),
        metadata: {
          total: totalUsers,
          page: 1,
          lastPage: Math.ceil(totalUsers / paginationDto.limit),
        },
      };

      const result = await useCase.execute(paginationDto);

      expect(result).toEqual(expectedResponse);
      expect(userService.getUsers).toHaveBeenCalledWith(paginationDto);
      expect(userService.getTotalUsers).toHaveBeenCalled();
    });

    it('should return an empty list if no users found', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };

      userService.getUsers = jest.fn().mockResolvedValue([]);
      userService.getTotalUsers = jest.fn().mockResolvedValue(0);

      const expectedResponse: ListUserResponseDto = {
        users: [],
        metadata: {
          total: 0,
          page: 1,
          lastPage: 0,
        },
      };

      const result = await useCase.execute(paginationDto);

      expect(result).toEqual(expectedResponse);
      expect(userService.getUsers).toHaveBeenCalledWith(paginationDto);
      expect(userService.getTotalUsers).toHaveBeenCalled();
    });
  });
});
