import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
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
}
