export class Order {
  constructor(
    public readonly id: string,
    public readonly user: string,
    public readonly items: Array<{
      product: string;
      quantity: number;
      price: number;
    }>,
    public readonly status: string,
    public readonly totalAmount: number,
    public readonly totalItems: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
