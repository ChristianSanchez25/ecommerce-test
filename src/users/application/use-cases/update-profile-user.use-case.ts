import { Inject, Injectable } from '@nestjs/common';
import { UserMapper } from '../../../common';
import { SERVICE_USER } from '../../domain/constants';
import { UpdateProfileDto, UserResponseDto } from '../dtos';
import { IUserService } from '../interfaces';

@Injectable()
export class UpdateProfileUserUseCase {
  constructor(
    @Inject(SERVICE_USER) private readonly userService: IUserService,
  ) {}

  async execute(
    id: string,
    profile: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateProfile(id, profile);
    return UserMapper.toDto(user);
  }
}
