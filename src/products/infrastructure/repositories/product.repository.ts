import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import {
  DatabaseException,
  Order,
  PaginationDto,
  ProductMapper,
} from '../../../common';
import { CreateProductDto } from '../../application/dtos';
import { IProductRepository } from '../../application/interfaces';
import { Product } from '../../domain/entities';
import { ProductDocument } from '../schemas/product.schema';

export class ProductRepository implements IProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    try {
      const product = await this.productModel.exists({
        productCode: data.productCode,
      });
      if (product) {
        throw new BadRequestException(
          `Product with code: ${data.productCode} already exists`,
        );
      }

      const productSchema = new this.productModel(data);
      await productSchema.save();
      return ProductMapper.toEntity(productSchema);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.handleDatabaseError(error, 'ERROR_CREATE_PRODUCT');
    }
  }

  async findById(id: string): Promise<Product> {
    try {
      const product = await this.productModel
        .findOne({
          _id: id,
          available: true,
        })
        .exec();
      if (!product) {
        return null;
      }
      return ProductMapper.toEntity(product);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_PRODUCT_BY_ID');
    }
  }

  async findAll(pagination: PaginationDto): Promise<Product[]> {
    const {
      limit = 10,
      page = 1,
      sort = 'updatedAt',
      order = Order.DESC,
    } = pagination;
    const sortOrder = order === Order.ASC ? 1 : -1;
    try {
      const products = await this.productModel
        .find({ available: true })
        .sort({ [sort]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      return products.map(ProductMapper.toEntity);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_FIND_PRODUCTS');
    }
  }

  async update(id: string, product: Product): Promise<Product> {
    try {
      const productUpdated = await this.productModel
        .findByIdAndUpdate(id, product, {
          new: true,
        })
        .exec();
      if (!productUpdated) {
        return null;
      }
      return ProductMapper.toEntity(productUpdated);
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_UPDATE_PRODUCT');
    }
  }

  async totalProducts(): Promise<number> {
    try {
      return this.productModel.countDocuments({ available: true }).exec();
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_TOTAL_PRODUCTS');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.productModel
        .findByIdAndUpdate(id, { available: false })
        .exec();
      return true;
    } catch (error) {
      this.handleDatabaseError(error, 'ERROR_DELETE_PRODUCT');
    }
  }

  async validateProducts(ids: string[]): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find({
          _id: { $in: ids },
          available: true,
        })
        .exec();
      if (products.length !== ids.length) {
        throw new BadRequestException(`Some products are not available`);
      }
      return products.map(ProductMapper.toEntity);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.handleDatabaseError(error, 'ERROR_VALIDATE_PRODUCTS');
    }
  }

  private handleDatabaseError(error: any, errorCode: string): never {
    if (error instanceof MongooseError) {
      throw new DatabaseException(error.message, errorCode);
    }
    throw new InternalServerErrorException(error.message, errorCode);
  }
}
