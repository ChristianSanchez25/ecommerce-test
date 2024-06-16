import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_AUTH } from '../../domain/constants';
import { LoginResponseDto } from '../dtos';
import { IAuthService } from '../interfaces';

@Injectable()
export class RenewUseCase {
  constructor(
    @Inject(SERVICE_AUTH) private readonly authService: IAuthService,
  ) {}

  async execute(email: string): Promise<LoginResponseDto> {
    return await this.authService.renewToken(email);
  }
}
