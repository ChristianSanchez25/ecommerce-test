import { PartialType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class UpdateProfileDto extends PartialType(ProfileDto) {}
