import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth, GetUser } from '../../../auth/infrastructure/decorators';
import { ErrorDto, MongoIdPipe, Order, PaginationDto } from '../../../common';
import {
  ListUserResponseDto,
  UpdateProfileDto,
  UserResponseDto,
} from '../../application/dtos';
import {
  GetUserUseCase,
  GetUsersUseCase,
  UpdateProfileUserUseCase,
} from '../../application/use-cases';
import { UserRole } from '../../domain/enums';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateProfileUseCase: UpdateProfileUserUseCase,
  ) {}

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated.',
    type: ErrorDto,
  })
  @ApiResponse({ status: 403, description: 'Not authorized.', type: ErrorDto })
  @ApiResponse({ status: 404, description: 'User not found.', type: ErrorDto })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Get(':id')
  async async(@Param('id', MongoIdPipe) id: string) {
    return await this.getUserUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({
    status: 200,
    description: 'The users have been successfully found.',
    type: ListUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated.',
    type: ErrorDto,
  })
  @ApiResponse({ status: 403, description: 'Not authorized.', type: ErrorDto })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false, enum: Order })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.getUsersUseCase.execute(paginationDto);
  }

  @ApiOperation({ summary: 'Update profile user' })
  @ApiResponse({
    status: 200,
    description: 'User Profile Updated',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  @ApiBearerAuth()
  @Get('profile/info-user')
  @Auth()
  async infoUser(@GetUser() user: UserResponseDto) {
    return user;
  }

  @ApiOperation({ summary: 'Get User' })
  @ApiResponse({ status: 200, description: 'User info', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorDto })
  @ApiResponse({ status: 404, description: 'User not found', type: ErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  @ApiBearerAuth()
  @Patch('profile')
  @Auth()
  async updateProfile(
    @GetUser() user: UserResponseDto,
    @Body() profile: UpdateProfileDto,
  ) {
    return await this.updateProfileUseCase.execute(user.id, profile);
  }
}
