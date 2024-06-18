import {
  Body,
  Controller,
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
import { Auth, GetUser } from '../../../auth/infrastructure/decorators';
import { ErrorDto, MongoIdPipe, Order } from '../../../common';
import { UserResponseDto } from '../../../users/application/dtos';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  ListOrderResponseDto,
  OrderResponseDto,
  PaginationOrderDto,
} from '../../application/dtos';
import {
  ChangeOrderStatusUseCase,
  CreateOrderUseCase,
  GetOrderUseCase,
  GetOrdersByUserUseCase,
  GetOrdersUseCase,
} from '../../application/use-cases';
import { OrderStatus } from '../../domain/enums';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly getOrdersByUserUseCase: GetOrdersByUserUseCase,
    private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase,
  ) {}

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

  @ApiOperation({ summary: 'Get Orders by User Auth' })
  @ApiResponse({
    status: 200,
    description: 'The orders have been successfully found.',
    type: ListOrderResponseDto,
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
    description: 'Orders not found.',
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
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiBearerAuth()
  @Auth()
  @Get('me')
  async findByuserAuth(
    @GetUser() user: UserResponseDto,
    @Query() paginationDto: PaginationOrderDto,
  ) {
    return await this.getOrdersByUserUseCase.execute(user.id, paginationDto);
  }

  @ApiOperation({ summary: 'Get Order by Id' })
  @ApiResponse({
    status: 200,
    description: 'The order have been successfully found.',
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
    status: 404,
    description: 'Order not found.',
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
    return await this.getOrderUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Get Orders' })
  @ApiResponse({
    status: 200,
    description: 'The orders have been successfully found.',
    type: ListOrderResponseDto,
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
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiBearerAuth()
  @Auth()
  @Get()
  async findAll(@Query() paginationDto: PaginationOrderDto) {
    return await this.getOrdersUseCase.execute(paginationDto);
  }

  @ApiOperation({ summary: 'Get Orders by UserId' })
  @ApiResponse({
    status: 200,
    description: 'The orders have been successfully found.',
    type: ListOrderResponseDto,
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
    description: 'Orders not found.',
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
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiBearerAuth()
  @Auth()
  @Get('users/:userId')
  async findByuser(
    @Param('userId', MongoIdPipe) userId: string,
    @Query() paginationDto: PaginationOrderDto,
  ) {
    return await this.getOrdersByUserUseCase.execute(userId, paginationDto);
  }

  @ApiOperation({ summary: 'Change Order Status' })
  @ApiResponse({
    status: 200,
    description: 'The order status has been successfully updated.',
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
    status: 404,
    description: 'Order not found.',
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
    @Body() order: ChangeOrderStatusDto,
  ) {
    return await this.changeOrderStatusUseCase.execute(id, order);
  }
}
