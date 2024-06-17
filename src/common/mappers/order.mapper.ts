import { Order } from '../../orders/domain/entities';
import { OrderDocument } from '../../orders/infrastructure/schemas';

export class OrderMapper {
  static toEntity(orderDocument: OrderDocument): Order {
    return new Order(
      orderDocument._id.toString(),
      orderDocument.user.toString(),
      orderDocument.items.map((item) => ({
        product: item.product.toString(),
        quantity: item.quantity,
        price: item.price,
      })),
      orderDocument.status,
      orderDocument.totalAmount,
      orderDocument.totalItems,
      orderDocument.createdAt,
      orderDocument.updatedAt,
    );
  }
}
