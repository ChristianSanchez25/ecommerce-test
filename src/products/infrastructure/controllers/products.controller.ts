import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../../../auth/infrastructure/decorators';
import { ErrorDto, MongoIdPipe, Order, PaginationDto } from '../../../common';
import { UserRole } from '../../../users/domain/enums';
import {
  CreateProductDto,
  ListProductResponseDto,
  ProductResponseDto,
  UpdateProductDto,
} from '../../application/dtos';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductUseCase,
  GetProductsUseCase,
  UpdateProductUseCase,
} from '../../application/use-cases';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
  ) {}

  @ApiOperation({ summary: 'Create Product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated.',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  @ApiBearerAuth()
  @Auth()
  @Post()
  async create(@Body() product: CreateProductDto) {
    return await this.createProductUseCase.execute(product);
  }

  @ApiOperation({ summary: 'Get Products' })
  @ApiResponse({
    status: 200,
    description: 'The products have been successfully found.',
    type: ListProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated.',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false, enum: Order })
  @ApiBearerAuth()
  @Auth()
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.getProductsUseCase.execute(paginationDto);
  }

  @ApiOperation({ summary: 'Get Product' })
  @ApiResponse({
    status: 200,
    description: 'The product have been successfully found.',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated.',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  @ApiBearerAuth()
  @Auth()
  @Get(':id')
  async findOne(@Param('id', MongoIdPipe) id: string) {
    return await this.getProductUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update Product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated.',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  @ApiBearerAuth()
  @Auth()
  @Patch(':id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() product: UpdateProductDto,
  ) {
    return await this.updateProductUseCase.execute(id, product);
  }

  @ApiOperation({ summary: 'Delete Product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated.',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized.',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id', MongoIdPipe) id: string) {
    return await this.deleteProductUseCase.execute(id);
  }
}
