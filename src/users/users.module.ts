import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { REPOSITORY_USER } from './domain/constants';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { User, UserSchema } from './infrastructure/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [
    UserRepository,
    {
      provide: REPOSITORY_USER,
      useClass: UserRepository,
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
