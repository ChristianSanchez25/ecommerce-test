import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class ProfileDto {
  @ApiProperty({ example: 'Jonh', description: 'First Name' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName: string;
  @ApiProperty({ example: 'Doe', description: 'Last Name' })
  @MinLength(3)
  @MaxLength(50)
  lastName: string;
  @ApiProperty({
    example: 'https://avatar.com/avatar.png',
    description: 'Avatar',
  })
  @IsUrl()
  avatar: string;
}
