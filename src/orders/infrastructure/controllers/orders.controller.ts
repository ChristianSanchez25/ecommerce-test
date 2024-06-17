import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/infrastructure/decorators';
import { ErrorDto } from 'src/common';
import { CreateOrderDto, OrderResponseDto } from 'src/orders/application/dtos';
import { CreateOrderUseCase } from 'src/orders/application/use-cases';
import { UserResponseDto } from 'src/users/application/dtos';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: OrderResponseDto,
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
  async create(
    @GetUser() user: UserResponseDto,
    @Body() order: CreateOrderDto,
  ) {
    return await this.createOrderUseCase.execute(order, user.id);
  }

  // @ApiOperation({ summary: 'Get Products' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The products have been successfully found.',
  //   type: ListProductResponseDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Not authenticated.',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Internal server error',
  //   type: ErrorDto,
  // })
  // @ApiQuery({ name: 'limit', required: false, type: Number })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  // @ApiQuery({ name: 'order', required: false, enum: Order })
  // @ApiBearerAuth()
  // @Auth()
  // @Get()
  // async findAll(@Query() paginationDto: PaginationDto) {
  //   return await this.getProductsUseCase.execute(paginationDto);
  // }

  // @ApiOperation({ summary: 'Get Product' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The product have been successfully found.',
  //   type: ProductResponseDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Not authenticated.',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Product not found.',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Internal server error',
  //   type: ErrorDto,
  // })
  // @ApiBearerAuth()
  // @Auth()
  // @Get(':id')
  // async findOne(@Param('id', MongoIdPipe) id: string) {
  //   return await this.getProductUseCase.execute(id);
  // }

  // @ApiOperation({ summary: 'Update Product' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The product has been successfully updated.',
  //   type: ProductResponseDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Not authenticated.',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Product not found.',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Internal server error',
  //   type: ErrorDto,
  // })
  // @ApiBearerAuth()
  // @Auth()
  // @Patch(':id')
  // async update(
  //   @Param('id', MongoIdPipe) id: string,
  //   @Body() product: UpdateProductDto,
  // ) {
  //   return await this.updateProductUseCase.execute(id, product);
  // }

  // @ApiOperation({ summary: 'Delete Product' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The product has been successfully deleted.',
  //   type: String,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Not authenticated.',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: 'Not authorized.',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Product not found.',
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Internal server error',
  //   type: ErrorDto,
  // })
  // @ApiBearerAuth()
  // @Auth(UserRole.ADMIN)
  // @Delete(':id')
  // async remove(@Param('id', MongoIdPipe) id: string) {
  //   return await this.deleteProductUseCase.execute(id);
  // }
}
