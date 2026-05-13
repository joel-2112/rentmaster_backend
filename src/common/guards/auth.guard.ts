// src/common/guards/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route or controller is marked @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),   // method-level decorator
      context.getClass(),     // class-level decorator
    ]);

    // If public, skip auth entirely — return true immediately
    if (isPublic) return true;

    // Otherwise validate the session/token as normal
    const request = context.switchToHttp().getRequest();
    const user = request.user; // populated by better-auth middleware

    if (!user) {
      throw new UnauthorizedException(
        'ይህንን ለማድረግ መጀመሪያ መግባት (Login) አለብህ!'
      );
    }

    return true;
  }
}