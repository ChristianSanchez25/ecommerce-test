import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  UserModelMock,
  mockUserModel,
  usersSchemaMock,
} from '../../../../test';
import { RegisterUserDto, UpdateUserDto } from '../../../auth/application/dtos';
import { UserMapper } from '../../../common';
import { UpdateProfileDto } from '../../application/dtos';
import { UserRole } from '../../domain/enums';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserDocument } from '../../infrastructure/schemas/user.schema';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: Model<UserDocument>;
  const userExpected = usersSchemaMock[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'avatar.png',
        },
      };
      const userDoc = new UserModelMock(registerUserDto);

      userDoc.save = jest.fn().mockResolvedValue(userDoc);

      const result = await userRepository.create(registerUserDto);
      expect(result.email).toEqual(
        UserMapper.toEntity(userDoc as unknown as UserDocument).email,
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'johndoe@google.com';

      const result = await userRepository.findByEmail(email);
      expect(result.email).toEqual(userExpected.email);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
    });

    it('should return null if user is not found', async () => {
      const email = 'notfound@example.com';

      userModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await userRepository.findByEmail(email);
      expect(result).toBeNull();
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const userId = '1';
      const userDoc = new UserModelMock({ ...userExpected });

      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(userDoc),
      });

      const result = await userRepository.findById(userId);
      expect(result.id).toEqual(userExpected._id.toString());
      expect(userModel.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null if user is not found', async () => {
      const userId = '2';

      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await userRepository.findById(userId);
      expect(result).toBeNull();
      expect(userModel.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const userId = '1';
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        avatar: 'new-avatar.png',
      };
      const updatedUserDoc = new UserModelMock({
        _id: userId,
        profile: updateProfileDto,
      });

      userModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUserDoc),
      });

      const result = await userRepository.updateProfile(
        userId,
        updateProfileDto,
      );
      expect(result.id).toEqual(userExpected._id.toString());
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { profile: updateProfileDto },
        { new: true },
      );
    });
  });

  describe('totalUsers', () => {
    it('should return total number of users', async () => {
      userModel.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(usersSchemaMock.length),
      });

      const result = await userRepository.totalUsers();
      expect(result).toEqual(usersSchemaMock.length);
      expect(userModel.countDocuments).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { role: [UserRole.ADMIN] };
      const updatedUserDoc = new UserModelMock({
        _id: userId,
        roles: ['ADMIN'],
        ...userExpected,
      });

      userModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUserDoc),
      });

      const result = await userRepository.update(userId, updateUserDto);
      expect(result.email).toEqual(userExpected.email);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { ...updateUserDto, roles: [...updateUserDto.role] },
        { new: true },
      );
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const userId = '1';
      const newPassword = 'newpassword123';
      const updatedUserDoc = new UserModelMock({
        _id: userId,
        password: newPassword,
        ...userExpected,
      });

      userModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUserDoc),
      });

      const result = await userRepository.updatePassword(userId, newPassword);
      expect(result.email).toEqual(userExpected.email);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { password: newPassword },
        { new: true },
      );
    });
  });
});
