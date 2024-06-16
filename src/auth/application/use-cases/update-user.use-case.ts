import { Inject, Injectable } from '@nestjs/common';
import { UserMapper } from '../../../common';
import { UserResponseDto } from '../../../users/application/dtos';
import { SERVICE_AUTH } from '../../domain/constants';
import { UpdateUserDto } from '../dtos';
import { IAuthService } from '../interfaces';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(SERVICE_AUTH) private readonly authService: IAuthService,
  ) {}

  async execute(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.authService.updateUser(id, updateUserDto);
    return UserMapper.toDto(user);
  }
}
