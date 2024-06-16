import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/application/dtos';
import {
  ChangePasswordDto,
  LoginResponseDto,
  LoginUserDto,
  RegisterResponseDto,
  RegisterUserDto,
} from '../../application/dtos';
import {
  ChangePasswordUseCase,
  LoginUseCase,
  RegisterUseCase,
  RenewUseCase,
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
}
