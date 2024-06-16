import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/auth/application/interfaces';
import { envs } from 'src/config';
import { IUserRepository } from 'src/users/application/interfaces';
import { REPOSITORY_USER } from 'src/users/domain/constants';
import { User } from 'src/users/domain/entities';

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

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedException('Token is invalid');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    return user;
  }
}
