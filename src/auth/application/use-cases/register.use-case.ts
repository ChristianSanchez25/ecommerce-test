import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_AUTH } from '../../domain/constants';
import { RegisterResponseDto, RegisterUserDto } from '../dtos';
import { IAuthService } from '../interfaces';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(SERVICE_AUTH) private readonly authService: IAuthService,
  ) {}

  async execute(
    registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    const user = await this.authService.register(registerUserDto);
    return {
      id: user.id,
    };
  }
}
