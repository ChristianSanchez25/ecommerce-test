import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../../users/infrastructure/schemas';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  collection: 'orders',
  timestamps: true,
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: Array<{
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }>;

  @Prop({
    type: String,
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({
    type: Number,
    required: true,
  })
  totalAmount: number;

  @Prop({
    type: Number,
    required: true,
  })
  totalItems: number;

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
