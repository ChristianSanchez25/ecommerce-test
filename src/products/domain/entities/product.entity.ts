export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    quantity: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    id: string,
    name: string,
    description: string,
    price: number,
    quantity: number,
    createdAt?: Date,
    updatedAt?: Date,
  ): Product {
    return new Product(
      id,
      name,
      description,
      price,
      quantity,
      createdAt,
      updatedAt,
    );
  }
}
