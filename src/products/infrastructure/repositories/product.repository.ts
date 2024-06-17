import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, PaginationDto, ProductMapper } from '../../../common';
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
      if (await this.productModel.exists({ name: data.name })) {
        throw new BadRequestException(
          `Product with name ${data.name} already exists`,
        );
      }
      const productSchema = new this.productModel(data);
      await productSchema.save();
      return ProductMapper.toEntity(productSchema);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'ERROR_CREATE_PRODUCT');
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
      throw new InternalServerErrorException(error, 'ERROR_FIND_PRODUCT_BY_ID');
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
      throw new InternalServerErrorException(error, 'ERROR_FIND_PRODUCTS');
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
      throw new InternalServerErrorException(error, 'ERROR_UPDATE_PRODUCT');
    }
  }

  async totalProducts(): Promise<number> {
    try {
      return this.productModel.countDocuments({ available: true }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error, 'ERROR_TOTAL_PRODUCTS');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.productModel
        .findByIdAndUpdate(id, { available: false })
        .exec();
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error, 'ERROR_DELETE_PRODUCT');
    }
  }
}
