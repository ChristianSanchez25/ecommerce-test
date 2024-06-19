import { productsSchemaMock } from './product.schema.mock';

class ProductModelMock {
  _id: string;
  name: string;
  productCode: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    Object.assign(this, data);
    this._id = data._id || 'mocked_id';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static exists = jest.fn().mockResolvedValue(false);
  static create = jest
    .fn()
    .mockImplementation((data) => new ProductModelMock(data));
  static findOne = jest.fn().mockImplementation(() => new ProductModelMock({}));
  static find = jest.fn().mockImplementation(() => ({
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(productsSchemaMock),
  }));
  static findByIdAndUpdate = jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(productsSchemaMock[0]),
  }));
  static countDocuments = jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(productsSchemaMock.length),
  }));
  save = jest.fn().mockResolvedValue(this);
  exec = jest.fn().mockResolvedValue(this);
}

export const mockProductModel = ProductModelMock;
