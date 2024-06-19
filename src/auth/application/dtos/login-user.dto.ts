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
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'The password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character and must have at least 8 characters',
    },
  )
  password: string;
}
