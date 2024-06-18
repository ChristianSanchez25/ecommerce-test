import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/products/infrastructure/schemas/product.schema';
import { User } from '../../../users/infrastructure/schemas';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  collection: 'orders',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  user?: User;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: Product.name, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: Array<{
    productId: Types.ObjectId;
    product?: Product;
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

// Virtual population for user
OrderSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Virtual population for items.product
OrderSchema.virtual('items.product', {
  ref: 'Product',
  localField: 'items.productId',
  foreignField: '_id',
  justOne: true,
});
