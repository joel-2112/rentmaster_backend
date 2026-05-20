import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('BETTER_AUTH') private readonly auth: any
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    
    try {
      const session = await this.auth.api.getSession({
        headers: request.headers,
      });

      if (!session || !session.user) {
        throw new UnauthorizedException(
          'ይህንን ለማድረግ መጀመሪያ መግባት (Login) አለብህ!'
        );
      }

      request.user = session.user;
      return true;
    } catch (err) {
      throw new UnauthorizedException(
        'ይህንን ለማድረግ መጀመሪያ መግባት (Login) አለብህ!'
      );
    }
  }
}