import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Password123.',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
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
  oldPassword: string;

  @ApiProperty({
    example: '123Password.',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
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
  newPassword: string;
}
