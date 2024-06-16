import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserRepository } from '../../../users/application/interfaces';
import { REPOSITORY_USER } from '../../../users/domain/constants';
import { User } from '../../../users/domain/entities';
import { ENCRYPT, JWT } from '../../domain/constants';
import { LoginResponseDto, LoginUserDto, RegisterUserDto } from '../dtos';
import { IAuthService, IEncrypt, IJwtService, JwtPayload } from '../interfaces';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(REPOSITORY_USER) private readonly userRepository: IUserRepository,
    @Inject(ENCRYPT) private readonly encrypt: IEncrypt,
    @Inject(JWT) private readonly jwtService: IJwtService,
  ) {}

  async register(data: RegisterUserDto): Promise<User> {
    const user = await this.userRepository.findByEmail(data.email);
    if (user) {
      throw new BadRequestException(
        `User with email ${data.email} already exists`,
      );
    }
    return this.userRepository.create({
      ...data,
      password: this.encrypt.encrypt(data.password, 10),
    });
  }
  async login(data: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }
    if (!this.encrypt.compare(data.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }
    return {
      token: await this.getJWTToken({ id: user.id }),
    };
  }

  async renewToken(email: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }
    return {
      token: await this.getJWTToken({ id: user.id }),
    };
  }

  private async getJWTToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload);
  }
}
