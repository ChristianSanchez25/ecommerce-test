import { UserResponseDto } from '../../users/application/dtos';
import { User, UserProfile } from '../../users/domain/entities';
import { UserRole } from '../../users/domain/enums';
import { UserDocument } from '../../users/infrastructure/schemas/user.schema';

export class UserMapper {
  static toEntity(userDocument: UserDocument): User {
    return new User(
      userDocument._id.toString(),
      userDocument.email,
      userDocument.password,
      userDocument.isActive,
      new UserProfile(
        userDocument.profile.firstName,
        userDocument.profile.lastName,
        userDocument.profile.avatar,
      ),
      userDocument.roles as UserRole[],
      userDocument.createdAt,
      userDocument.updatedAt,
    );
  }

  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      roles: user.roles,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        avatar: user.profile.avatar,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
