import { OrderResponseDto } from 'src/orders/application/dtos';
import { OrderDocument } from 'src/orders/infrastructure/schemas';

export class OrderMapper {
  static toDto(order: OrderDocument): OrderResponseDto {
    return {
      id: order._id.toString(),
      userId: order.userId.toString(),
      userEmail: order.user?.email,
      items: order.items.map((item) => ({
        productId: item.productId.toString(),
        productName: item.product?.name,
        available: item.product?.available,
        quantity: item.quantity,
        price: item.price,
      })),
      status: order.status,
      totalAmount: order.totalAmount,
      totalItems: order.totalItems,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
