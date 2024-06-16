import { Inject, Injectable } from '@nestjs/common';
import { UserResponseDto } from 'src/users/application/dtos';
import { SERVICE_AUTH } from '../../domain/constants';
import { ChangePasswordDto } from '../dtos';
import { IAuthService } from '../interfaces';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(SERVICE_AUTH) private readonly authService: IAuthService,
  ) {}

  async execute(user: UserResponseDto, password: ChangePasswordDto) {
    const result = await this.authService.changePassword(user, password);
    if (result) {
      return 'Password changed successfully';
    }
  }
}
