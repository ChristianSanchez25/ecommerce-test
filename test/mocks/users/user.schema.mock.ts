import { UserDocument } from '../../../src/users/infrastructure/schemas/user.schema';

export const usersSchemaMock: UserDocument[] = [
  {
    _id: '1',
    email: 'johndoe@google.com',
    password: 'Password123.',
    isActive: true,
    roles: ['ADMIN'],
    profile: {
      firstName: 'Jonh',
      lastName: 'Doe',
      avatar:
        'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as UserDocument,
  {
    id: '2',
    email: 'test@test.com',
    password: 'Password123.',
    isActive: true,
    roles: ['USER'],
    profile: {
      firstName: 'Test',
      lastName: 'User',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as UserDocument,
  {
    id: '3',
    email: 'anadoe@google.com',
    password: 'badpassword',
    isActive: true,
    roles: ['ADMIN'],
    profile: {
      firstName: 'Ana',
      lastName: 'Doe',
      avatar:
        'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as UserDocument,
];
