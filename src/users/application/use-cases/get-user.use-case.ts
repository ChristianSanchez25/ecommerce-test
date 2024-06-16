import { Inject, Injectable } from '@nestjs/common';
import { UserMapper } from '../../../common';
import { SERVICE_USER } from '../../domain/constants';
import { UserResponseDto } from '../dtos';
import { IUserService } from '../interfaces';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(SERVICE_USER) private readonly userService: IUserService,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(id);
    return UserMapper.toDto(user);
  }
}
