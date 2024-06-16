import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common';
import { MongoModule } from './persistences/mongo.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, CommonModule, UsersModule, MongoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
