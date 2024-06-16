import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MongoIdPipe } from '../../../common';
import { UserResponseDto } from '../../../users/application/dtos';
import { UserRole } from '../../../users/domain/enums';
import {
  ChangePasswordDto,
  LoginResponseDto,
  LoginUserDto,
  RegisterResponseDto,
  RegisterUserDto,
  UpdateUserDto,
} from '../../application/dtos';
import {
  ChangePasswordUseCase,
  LoginUseCase,
  RegisterUseCase,
  RenewUseCase,
  UpdateUserUseCase,
} from '../../application/use-cases';
import { Auth, GetUser } from '../decorators';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly renewUseCase: RenewUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly updateUseCase: UpdateUserUseCase,
  ) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    return await this.registerUseCase.execute(registerUserDto);
  }

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 201,
    description: 'User logged successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute(loginUserDto);
  }

  @ApiOperation({ summary: 'Renew Token' })
  @ApiResponse({
    status: 200,
    description: 'Token renewed successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  @Auth()
  @Get('renew-token')
  async renew(@GetUser() user: UserResponseDto): Promise<LoginResponseDto> {
    return await this.renewUseCase.execute(user.email);
  }

  @ApiOperation({ summary: 'Change Password User' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  @Auth()
  @Patch('change-password')
  async changePassword(
    @GetUser() user: UserResponseDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.changePasswordUseCase.execute(user, changePasswordDto);
  }

  @ApiOperation({ summary: 'Activate and change role' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 401, description: 'Not authenticated.' })
  @ApiResponse({ status: 403, description: 'Not authorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.updateUseCase.execute(id, updateUserDto);
  }
}
