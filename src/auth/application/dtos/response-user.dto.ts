import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'ANCAKSBFDFGBWDIFBSD48186',
    description: 'user token',
  })
  token: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: 'IDFGBWDIFBSD4818',
    description: 'user id',
  })
  id: string;
}
