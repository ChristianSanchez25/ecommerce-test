import * as bcrypt from 'bcryptjs';
import { IEncrypt } from '../../application/interfaces';

export class EncryptProvider implements IEncrypt {
  encrypt(value: string, salt: number): string {
    return bcrypt.hashSync(value, salt);
  }
  compare(value: string, hash: string): boolean {
    return bcrypt.compareSync(value, hash);
  }
}
