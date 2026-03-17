import { Controller, All, Req, Res, Inject, Next } from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from "better-auth/node";

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject('BETTER_AUTH') private readonly auth: any
  ) {}

  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.auth)(req, res);
  }
}