import { UserRole } from '../enums/user-role.enum';
import { UserProfile } from './user-profile.entity';

export class User {
  id: string;
  email: string;
  password: string;
  isActive: boolean = true;
  profile: UserProfile;
  roles: UserRole[] = [];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    isActive: boolean,
    profile: UserProfile,
    userRoles: UserRole[] = [],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.profile = profile;
    this.roles = userRoles;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    id: string,
    email: string,
    password: string,
    isActive: boolean,
    profile: UserProfile,
    userRoles: UserRole[] = [],
    createdAt?: Date,
    updatedAt?: Date,
  ): User {
    return new User(
      id,
      email,
      password,
      isActive,
      profile,
      userRoles,
      createdAt,
      updatedAt,
    );
  }
}
