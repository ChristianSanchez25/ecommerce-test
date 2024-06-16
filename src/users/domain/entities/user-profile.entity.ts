export class UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;

  constructor(firstName: string, lastName: string, avatar?: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatar = avatar;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  static create(
    firstName: string,
    lastName: string,
    avatar?: string,
  ): UserProfile {
    return new UserProfile(firstName, lastName, avatar);
  }
}
