import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Profile, ProfileSchema } from './profile.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({ type: ProfileSchema, required: true })
  profile: Profile;

  @Prop({
    type: Boolean,
    default: false,
  })
  emailVerified: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: [String],
    default: ['USER'],
  })
  roles: string[];

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
