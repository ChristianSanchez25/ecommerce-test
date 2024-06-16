import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({})
export class Profile {
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
  })
  avatar: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
