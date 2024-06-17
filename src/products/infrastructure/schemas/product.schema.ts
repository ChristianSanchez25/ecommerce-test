import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  collection: 'products',
  timestamps: true,
})
export class Product {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type: Boolean,
    default: true,
    index: true,
  })
  available: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  quantity: number;

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
