import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserMapper } from '../../../common';
import { envs } from '../../../config';
import { UserResponseDto } from '../../../users/application/dtos';
import { IUserRepository } from '../../../users/application/interfaces';
import { REPOSITORY_USER } from '../../../users/domain/constants';
import { JwtPayload } from '../../application/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(REPOSITORY_USER) private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.jwt.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserResponseDto> {
    const { id } = payload;
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedException('Token is invalid');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    return UserMapper.toDto(user);
  }
}
