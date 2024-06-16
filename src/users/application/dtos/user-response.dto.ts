import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../domain/enums';
import { ProfileDto } from './profile.dto';

export class UserResponseDto {
  @ApiProperty({ example: '60f7b3b3b3f3f3f3f3f3f3f3', description: 'User ID' })
  id: string;
  @ApiProperty({
    example: 'jonhdoe@google.com',
    description: 'User email',
  })
  email: string;
  @ApiProperty({ example: true, description: 'Is Active' })
  isActive: boolean;
  @ApiProperty({
    example: ['USER'],
    description: 'Roles of the user',
    enum: UserRole,
    isArray: true,
  })
  roles: UserRole[];
  @ApiProperty({
    type: ProfileDto,
    description: 'Profile of the user',
  })
  profile: ProfileDto;
  @ApiProperty({
    example: '2021-07-21T00:00:00.000Z',
    description: 'Date of creation',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-07-21T00:00:00.000Z',
    description: 'Date of the last update',
  })
  updatedAt: Date;
}
