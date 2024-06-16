import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { ProfileUserDto } from './profile-user.dto';

export class RegisterUserDto {
  @ApiProperty({
    example: 'johndoe@google.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsString()
  email: string;
  @ApiProperty({
    example: 'Password123.',
    description: 'The password of the user',
  })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ description: 'Profile of the user' })
  @ValidateNested({ each: true })
  @Type(() => ProfileUserDto)
  @IsNotEmpty()
  profile: ProfileUserDto;
}
