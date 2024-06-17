import { Product } from 'src/products/domain/entities';
import { ProductDocument } from 'src/products/infrastructure/schemas/product.schema';

export class ProductMapper {
  static toEntity(productDocument: ProductDocument): Product {
    return new Product(
      productDocument._id.toString(),
      productDocument.name,
      productDocument.description,
      productDocument.price,
      productDocument.quantity,
      productDocument.createdAt,
      productDocument.updatedAt,
    );
  }
}
