import { User } from '../../../users/domain/entities';
import { LoginResponseDto, LoginUserDto, RegisterUserDto } from '../dtos';

export interface IAuthService {
  register(data: RegisterUserDto): Promise<User>;
  login(data: LoginUserDto): Promise<LoginResponseDto>;
  renewToken(email: string): Promise<LoginResponseDto>;
}
