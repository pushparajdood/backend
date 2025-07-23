import { TokenBlacklistService } from '@lms-backend/auth';
import {
  ExecutionContext,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => TokenBlacklistService))
    private tokenblacklistService: TokenBlacklistService
  ) {
    super();
  }
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const isAuthenticated = (await super.canActivate(context)) as boolean;

    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (token && (await this.tokenblacklistService.isTokenBlacklisted(token))) {
      throw new ForbiddenException('Token has been invalidated.');
      //return false
    }
    return true;
  }
}
