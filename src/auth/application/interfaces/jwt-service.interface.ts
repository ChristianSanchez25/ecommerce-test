import { JwtPayload } from './jwt-payload.interface';

export interface IJwtService {
  signAsync(payload: JwtPayload): Promise<string>;
  verifyAsync(token: string): Promise<JwtPayload>;
}
