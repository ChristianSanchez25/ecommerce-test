import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envs } from '../../../config';
import { IJwtService, JwtPayload } from '../../application/interfaces';

@Injectable()
export class JwtProvider implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}
  signAsync(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
  verifyAsync(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, { secret: envs.jwt.secret });
  }
}
