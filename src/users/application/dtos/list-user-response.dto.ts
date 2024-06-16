import { ApiProperty } from '@nestjs/swagger';
import { Metadata } from '../../../common';
import { UserResponseDto } from './user-response.dto';

export class ListUserResponseDto {
  @ApiProperty({
    type: [UserResponseDto],
    description: 'users',
  })
  users: UserResponseDto[];

  @ApiProperty({
    example: Metadata,
    description: 'total users, current page and total pages',
  })
  metadata: Metadata;
}
