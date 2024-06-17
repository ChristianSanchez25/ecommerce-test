import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { UpdateProfileDto } from 'src/users/application/dtos';
import { RegisterUserDto, UpdateUserDto } from '../../../auth/application/dtos';
import {
  DatabaseException,
  Order,
  PaginationDto,
  UserMapper,
} from '../../../common';
import { IUserRepository } from '../../application/interfaces';
import { User } from '../../domain/entities';
import { UserDocument } from '../schemas/user.schema';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: RegisterUserDto): Promise<User> {
    try {
      const userSchema = new this.userModel({
        email: data.email,
        password: data.password,
        profile: data.profile,
      });
      await userSchema.save();
      return UserMapper.toEntity(userSchema);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_CREATE_USER');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({
          email,
        })
        .exec();
      if (!user) {
        return null;
      }
      return UserMapper.toEntity(user);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_USER_BY_EMAIL');
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        return null;
      }
      return UserMapper.toEntity(user);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_USER_BY_ID');
    }
  }
  async updateProfile(id: string, data: UpdateProfileDto): Promise<User> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(
          id,
          {
            profile: data,
          },
          {
            new: true,
          },
        )
        .exec();
      if (!user) {
        return null;
      }
      return UserMapper.toEntity(user);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_UPDATE_PROFILE_USER');
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<User[]> {
    const {
      limit = 10,
      page = 1,
      sort = 'updatedAt',
      order = Order.DESC,
    } = paginationDto;
    const sortOrder = order === Order.ASC ? 1 : -1;
    try {
      const users = await this.userModel
        .find()
        .sort({ [sort]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      return users.map((user) => UserMapper.toEntity(user));
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_ALL_USERS');
    }
  }

  async totalUsers(): Promise<number> {
    try {
      return this.userModel.countDocuments().exec();
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_TOTAL_USERS');
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const { role } = data;
      const user = await this.userModel
        .findByIdAndUpdate(
          id,
          {
            ...data,
            roles: [...role],
          },
          {
            new: true,
          },
        )
        .exec();
      return UserMapper.toEntity(user);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_UPDATE_USER');
    }
  }

  async updatePassword(id: string, password: string): Promise<User> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(
          id,
          {
            password,
          },
          {
            new: true,
          },
        )
        .exec();
      if (!user) {
        return null;
      }
      return UserMapper.toEntity(user);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_UPDATE_PASSWORD_USER');
    }
  }

  private handleDatabaseError(error: any, errorCode: string): never {
    if (error instanceof MongooseError) {
      throw new DatabaseException(error.message, errorCode);
    }
    throw new InternalServerErrorException(error.message, errorCode);
  }
}
