import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, MongooseError } from 'mongoose';
import { mockProductModel, productsSchemaMock } from '../../../../test';
import { DatabaseException, Order, ProductMapper } from '../../../common';
import { CreateProductDto, UpdateProductDto } from '../../application/dtos';
import { Product } from '../../domain/entities';
import { ProductDocument } from '../schemas/product.schema';
import { ProductRepository } from './product.repository';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let productModel: Model<ProductDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
    productModel = module.get<Model<ProductDocument>>(
      getModelToken(Product.name),
    );
  });

  it('should be defined', () => {
    expect(productRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        productCode: 'ABC',
        price: 100,
        quantity: 10,
        description: 'Product 1 description',
      };
      mockProductModel.exists.mockResolvedValue(false);
      const productDoc = new mockProductModel({
        ...createProductDto,
        _id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      productDoc.save = jest.fn().mockResolvedValue(productDoc);

      const result = await productRepository.create(createProductDto);
      expect(result.name).toEqual(
        ProductMapper.toEntity(productDoc as unknown as ProductDocument).name,
      );
      expect(mockProductModel.exists).toHaveBeenCalledWith({
        productCode: createProductDto.productCode,
      });
    });

    it('should throw BadRequestException if product already exists', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        productCode: 'ABC',
        price: 100,
        quantity: 10,
        description: 'Product 1 description',
      };
      mockProductModel.exists.mockResolvedValue(true);

      await expect(productRepository.create(createProductDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockProductModel.exists).toHaveBeenCalledWith({
        productCode: createProductDto.productCode,
      });
    });
  });

  describe('findById', () => {
    it('should return a product if it exists', async () => {
      mockProductModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(productsSchemaMock[0]),
      }));

      const result = await productRepository.findById('1');
      expect(result).toEqual(
        ProductMapper.toEntity(productsSchemaMock[0] as ProductDocument),
      );
      expect(mockProductModel.findOne).toHaveBeenCalledWith({
        _id: '1',
        available: true,
      });
    });

    it('should return null if the product does not exist', async () => {
      mockProductModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      const result = await productRepository.findById('1');
      expect(result).toBeNull();
      expect(mockProductModel.findOne).toHaveBeenCalledWith({
        _id: '1',
        available: true,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      mockProductModel.find.mockImplementation(() => ({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(productsSchemaMock),
      }));

      const result = await productRepository.findAll({
        page: 1,
        limit: 10,
        sort: 'updatedAt',
        order: Order.DESC,
      });
      expect(result).toEqual(
        productsSchemaMock.map((product) =>
          ProductMapper.toEntity(product as ProductDocument),
        ),
      );
      expect(mockProductModel.find).toHaveBeenCalledWith({ available: true });
    });
  });

  describe('update', () => {
    it('should update a product if it exists', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated description',
        price: 150,
        quantity: 15,
      };
      const productToUpdate = {
        ...productsSchemaMock[0],
        ...updateProductDto,
        updatedAt: new Date(),
      };
      mockProductModel.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(productToUpdate),
      }));

      const result = await productRepository.update(
        '1',
        productToUpdate as Product,
      );
      expect(result).toEqual(
        ProductMapper.toEntity(productToUpdate as ProductDocument),
      );
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        productToUpdate,
        { new: true },
      );
    });

    it('should return null if the product does not exist', async () => {
      mockProductModel.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      const result = await productRepository.update(
        '1',
        productsSchemaMock[0] as Product,
      );
      expect(result).toBeNull();
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        productsSchemaMock[0],
        { new: true },
      );
    });
  });

  describe('totalProducts', () => {
    it('should return the total number of products', async () => {
      mockProductModel.countDocuments.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(productsSchemaMock.length),
      }));

      const result = await productRepository.totalProducts();
      expect(result).toEqual(productsSchemaMock.length);
      expect(mockProductModel.countDocuments).toHaveBeenCalledWith({
        available: true,
      });
    });
  });

  describe('delete', () => {
    it('should mark a product as unavailable', async () => {
      mockProductModel.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(productsSchemaMock[0]),
      }));

      const result = await productRepository.delete('1');
      expect(result).toBe(true);
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith('1', {
        available: false,
      });
    });
  });

  describe('validateProducts', () => {
    it('should return products if all ids are valid', async () => {
      const ids = productsSchemaMock.map((product) => product._id.toString());
      mockProductModel.find.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(productsSchemaMock),
      }));

      const result = await productRepository.validateProducts(ids);
      expect(result).toEqual(
        productsSchemaMock.map((product) =>
          ProductMapper.toEntity(product as ProductDocument),
        ),
      );
      expect(mockProductModel.find).toHaveBeenCalledWith({
        _id: { $in: ids },
        available: true,
      });
    });

    it('should throw BadRequestException if some products are not available', async () => {
      const ids = productsSchemaMock.map((product) => product._id.toString());
      mockProductModel.find.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(productsSchemaMock.slice(0, 1)),
      }));

      await expect(productRepository.validateProducts(ids)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockProductModel.find).toHaveBeenCalledWith({
        _id: { $in: ids },
        available: true,
      });
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleDatabaseError(error: any, errorCode: string): never {
    if (error instanceof MongooseError) {
      throw new DatabaseException(error.message, errorCode);
    }
    throw new InternalServerErrorException(error.message, errorCode);
  }
});
