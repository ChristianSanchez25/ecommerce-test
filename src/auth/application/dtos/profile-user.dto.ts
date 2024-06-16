import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ProfileUserDto {
  @ApiProperty({ example: 'john', description: 'The name of the user' })
  @IsString()
  firstName: string;
  @ApiProperty({ example: 'doe', description: 'The last name of the user' })
  @IsString()
  lastName: string;
  @ApiProperty({
    example: 'https://www.google.com/image.png',
    description: 'The image of the user',
  })
  @IsUrl()
  @IsOptional()
  avatar?: string;
}
