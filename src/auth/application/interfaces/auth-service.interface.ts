import { UserResponseDto } from '../../../users/application/dtos';
import { User } from '../../../users/domain/entities';
import {
  ChangePasswordDto,
  LoginResponseDto,
  LoginUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from '../dtos';

export interface IAuthService {
  register(data: RegisterUserDto): Promise<User>;
  login(data: LoginUserDto): Promise<LoginResponseDto>;
  renewToken(email: string): Promise<LoginResponseDto>;
  changePassword(
    user: UserResponseDto,
    passwordDto: ChangePasswordDto,
  ): Promise<boolean>;
  updateUser(id: string, data: UpdateUserDto): Promise<User>;
}
