import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '../common';
import { envs } from '../config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/services/auth.service';
import {
  ChangePasswordUseCase,
  LoginUseCase,
  RegisterUseCase,
  RenewUseCase,
  UpdateUserUseCase,
} from './application/use-cases';
import { ENCRYPT, JWT, SERVICE_AUTH } from './domain/constants';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { JwtProvider } from './infrastructure/providers';
import { EncryptProvider } from './infrastructure/providers/encrypt.provider';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.jwt.secret,
      signOptions: { expiresIn: envs.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: SERVICE_AUTH,
      useClass: AuthService,
    },
    {
      provide: ENCRYPT,
      useClass: EncryptProvider,
    },
    {
      provide: JWT,
      useClass: JwtProvider,
    },
    RegisterUseCase,
    LoginUseCase,
    RenewUseCase,
    ChangePasswordUseCase,
    UpdateUserUseCase,
  ],
  exports: [JwtStrategy, JwtModule, PassportModule],
})
export class AuthModule {}
