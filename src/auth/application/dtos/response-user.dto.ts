import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9fsfdsdfdsfsfsdfsdvsdvfbzY',
    description: 'user token',
  })
  token: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: '60f7b3b3b3f3f3f3f3f3f3f3',
    description: 'user id',
  })
  id: string;
}
