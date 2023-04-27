import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  login() {
    // this.logger.log('[LOGIN], Start function login');
  }

  signup() {
    // this.logger.log('[SIGNUP], Start function signup');
  }
}
