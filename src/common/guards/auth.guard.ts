import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('BETTER_AUTH') private readonly auth: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    const session = await this.auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new UnauthorizedException('ይህንን ለማድረግ መጀመሪያ መግባት (Login) አለብህ!');
    }

    request['user'] = session.user;
    request['session'] = session.session;

    return true;
  }
}