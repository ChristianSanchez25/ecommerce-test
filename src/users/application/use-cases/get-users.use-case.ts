import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto, UserMapper } from '../../../common';
import { SERVICE_USER } from '../../domain/constants';
import { ListUserResponseDto } from '../dtos';
import { IUserService } from '../interfaces';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(SERVICE_USER) private readonly userService: IUserService,
  ) {}

  async execute(pagination: PaginationDto): Promise<ListUserResponseDto> {
    const users = await this.userService.getUsers(pagination);
    const total = await this.userService.getTotalUsers();
    const { limit = 10, page = 1 } = pagination;

    return {
      users: users.map((user) => UserMapper.toDto(user)),
      metadata: {
        total,
        page: page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
