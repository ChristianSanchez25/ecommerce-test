import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envs } from '../config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/services/auth.service';
import {
  LoginUseCase,
  RegisterUseCase,
  RenewUseCase,
} from './application/use-cases';
import { ENCRYPT, JWT, SERVICE_AUTH } from './domain/constants';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { JwtProvider } from './infrastructure/providers';
import { EncryptProvider } from './infrastructure/providers/encrypt.provider';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.jwt.secret,
      signOptions: { expiresIn: '1h' },
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
  ],
  exports: [JwtStrategy, JwtModule, PassportModule],
})
export class AuthModule {}
