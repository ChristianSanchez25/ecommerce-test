import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProfileUserDto,
  RegisterUserDto,
} from '../../../auth/application/dtos';
import { UserMapper } from '../../../common';
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
      throw new InternalServerErrorException(error, 'ERROR_CREATE_USER');
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
      throw new InternalServerErrorException(error, 'ERROR_FIND_USER_BY_EMAIL');
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
      throw new InternalServerErrorException(error, 'ERROR_FIND_USER_BY_ID');
    }
  }
  async updateProfile(id: string, data: ProfileUserDto): Promise<User> {
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
      throw new InternalServerErrorException(
        error,
        'ERROR_UPDATE_PROFILE_USER',
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.find().exec();
      return users.map((user) => UserMapper.toEntity(user));
    } catch (error) {
      throw new InternalServerErrorException(error, 'ERROR_FIND_ALL_USERS');
    }
  }
}
