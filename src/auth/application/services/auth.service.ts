import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ILogger, LOGGER_SERVICE } from '../../../common';
import { UserResponseDto } from '../../../users/application/dtos';
import { IUserRepository } from '../../../users/application/interfaces';
import { REPOSITORY_USER } from '../../../users/domain/constants';
import { User } from '../../../users/domain/entities';
import { ENCRYPT, JWT } from '../../domain/constants';
import {
  ChangePasswordDto,
  LoginResponseDto,
  LoginUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from '../dtos';
import { IAuthService, IEncrypt, IJwtService, JwtPayload } from '../interfaces';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(REPOSITORY_USER) private readonly userRepository: IUserRepository,
    @Inject(ENCRYPT) private readonly encrypt: IEncrypt,
    @Inject(JWT) private readonly jwtService: IJwtService,
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
  ) {}

  async register(data: RegisterUserDto): Promise<User> {
    const user = await this.userRepository.findByEmail(data.email);
    if (user) {
      this.logger.warn('AuthService', `User ${user.email} already exists`);
      throw new BadRequestException(
        `User with email ${data.email} already exists`,
      );
    }
    const newUser = await this.userRepository.create({
      ...data,
      password: this.encrypt.encrypt(data.password, 10),
    });
    this.logger.log('AuthService', `User ${newUser.email} created`);
    return newUser;
  }
  async login(data: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }
    if (!this.encrypt.compare(data.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }
    this.logger.log('AuthService', `User ${user.email} logged in`);
    return {
      token: await this.getJWTToken({ id: user.id }),
    };
  }

  async renewToken(email: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }
    this.logger.log('AuthService', `User ${user.email} renewed token log`);
    return {
      token: await this.getJWTToken({ id: user.id }),
    };
  }

  async changePassword(
    user: UserResponseDto,
    passwordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const userEntity = await this.userRepository.findById(user.id);
    if (!userEntity) {
      this.logger.warn('AuthService', `User with id ${user.id} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!this.encrypt.compare(passwordDto.oldPassword, userEntity.password)) {
      this.logger.warn('AuthService', `User ${user.email} changed password`);
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.userRepository.updatePassword(
      user.id,
      this.encrypt.encrypt(passwordDto.newPassword, 10),
    );
    this.logger.log('AuthService', `User ${user.email} changed password`);
    return true;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn('AuthService', `User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = await this.userRepository.update(id, {
      ...data,
      role: data.role ? [...data.role] : user.roles,
    });

    this.logger.log('AuthService', `User ${user.email} updated`);
    return updatedUser;
  }

  private async getJWTToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload);
  }
}
