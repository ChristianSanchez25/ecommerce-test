import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_AUTH } from '../../domain/constants';
import { LoginResponseDto, LoginUserDto } from '../dtos';
import { IAuthService } from '../interfaces';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(SERVICE_AUTH) private readonly authService: IAuthService,
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginUserDto);
  }
}
