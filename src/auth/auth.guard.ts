import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenConstants } from 'src/user/constants';
import { Request } from 'express';
import { getWinstonLogger } from 'src/logger/winston-config';

const logger = getWinstonLogger()
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const userProfile = this.jwtService.verifyAsync(token, {
        secret: TokenConstants.TOKEN_SECRET_VALUE,
      });
      logger.info(`[canActive] user profile: ${JSON.stringify(userProfile)}`);
      request['user'] = userProfile;
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
