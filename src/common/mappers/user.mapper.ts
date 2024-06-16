import { User, UserProfile, UserRole } from '../../users/domain/entities';
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
}
