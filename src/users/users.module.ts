import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '../common';
import { UserService } from './application/services/user.service';
import {
  GetUserUseCase,
  GetUsersUseCase,
  UpdateProfileUserUseCase,
} from './application/use-cases';
import { REPOSITORY_USER, SERVICE_USER } from './domain/constants';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { User, UserSchema } from './infrastructure/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [
    UserRepository,
    GetUsersUseCase,
    GetUserUseCase,
    UpdateProfileUserUseCase,
    {
      provide: REPOSITORY_USER,
      useClass: UserRepository,
    },
    {
      provide: SERVICE_USER,
      useClass: UserService,
    },
  ],
  exports: [
    UserRepository,
    {
      provide: REPOSITORY_USER,
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}
