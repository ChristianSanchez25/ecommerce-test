import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../../../users/domain/entities';
import {
  LoginResponseDto,
  LoginUserDto,
  RegisterResponseDto,
  RegisterUserDto,
} from '../../application/dtos';
import {
  LoginUseCase,
  RegisterUseCase,
  RenewUseCase,
} from '../../application/use-cases';
import { Auth, GetUser } from '../decorators';

@Controller()
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly renewUseCase: RenewUseCase,
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
    try {
      return await this.registerUseCase.execute(registerUserDto);
    } catch (error) {
      throw new Error(error);
    }
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
    try {
      return await this.loginUseCase.execute(loginUserDto);
    } catch (error) {
      throw new Error(error);
    }
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
  async renew(@GetUser() user: User): Promise<LoginResponseDto> {
    try {
      return await this.renewUseCase.execute(user.email);
    } catch (error) {
      throw new Error(error);
    }
  }
}
