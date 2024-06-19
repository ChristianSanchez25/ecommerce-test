import { usersSchemaMock } from './user.schema.mock';

export class UserModelMock {
  _id: string;
  email: string;
  password: string;
  isActive: boolean;
  roles: string[];
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    Object.assign(this, data);
    this._id = data._id || 'mocked_id';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static exists = jest.fn().mockResolvedValue(false);
  static create = jest
    .fn()
    .mockImplementation((data) => new UserModelMock(data));
  static findOne = jest
    .fn()
    .mockImplementation(() => new UserModelMock(usersSchemaMock[0]));
  static find = jest.fn().mockImplementation(() => ({
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(usersSchemaMock),
  }));
  static findByIdAndUpdate = jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(usersSchemaMock[0]),
  }));
  static countDocuments = jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(usersSchemaMock.length),
  }));
  static findByEmail = jest.fn(
    (email: string) =>
      new UserModelMock(usersSchemaMock.find((user) => user.email === email)),
  );
  save = jest.fn().mockResolvedValue(this);
  exec = jest.fn().mockResolvedValue(this);
}

export const mockUserModel = UserModelMock;
