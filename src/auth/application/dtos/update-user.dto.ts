import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../users/domain/enums';

export class UpdateUserDto {
  @ApiProperty({ example: true, description: 'Is Active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: [UserRole.USER],
    description: 'Roles of the user',
    enum: UserRole,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, {
    each: true,
    message: `Each role must be one of the following values: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole[];
}
