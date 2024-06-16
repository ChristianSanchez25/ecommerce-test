import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/users/domain/enums';
import { User } from '../../../users/domain/entities';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: UserRole[] = this.reflector.get<UserRole[]>(
      META_ROLES,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    if (validRoles.some((role) => user.roles?.includes(role))) {
      return true;
    }

    throw new ForbiddenException(
      `User ${user.email} does not have the required role(s)`,
    );
  }
}
