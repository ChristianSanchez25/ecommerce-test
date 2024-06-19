import { User } from '../../../src/users/domain/entities';
import { UserRole } from '../../../src/users/domain/enums';

export const usersMock: User[] = [
  {
    id: '1',
    email: 'johndoe@google.com',
    password: 'Password123.',
    isActive: true,
    roles: [UserRole.ADMIN],
    profile: {
      firstName: 'Jonh',
      lastName: 'Doe',
      fullName: 'Jonh Doe',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'test@test.com',
    password: 'Password123.',
    isActive: true,
    roles: [UserRole.USER],
    profile: {
      firstName: 'Test',
      lastName: 'User',
      fullName: 'Test User',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'anadoe@google.com',
    password: 'badpassword',
    isActive: true,
    roles: [UserRole.ADMIN],
    profile: {
      firstName: 'Ana',
      lastName: 'Doe',
      fullName: 'Ana Doe',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
