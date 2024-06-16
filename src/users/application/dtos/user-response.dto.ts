import { UserRole } from '../../domain/enums';
import { ProfileDto } from './profile.dto';

export class UserResponseDto {
  id: string;
  email: string;
  isActive: boolean;
  roles: UserRole[];
  profile: ProfileDto;
  createdAt: Date;
  updatedAt: Date;
}
