import { Product } from '../../products/domain/entities';
import { ProductDocument } from '../../products/infrastructure/schemas/product.schema';

export class ProductMapper {
  static toEntity(productDocument: ProductDocument): Product {
    return new Product(
      productDocument._id.toString(),
      productDocument.name,
      productDocument.productCode,
      productDocument.description,
      productDocument.price,
      productDocument.quantity,
      productDocument.createdAt,
      productDocument.updatedAt,
    );
  }
}
