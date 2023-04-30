import { Logger, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private userService: UserService) {}

  login() {
    // this.logger.log('[LOGIN], Start function login');
  }

  signup() {
    // this.logger.log('[SIGNUP], Start function signup');
  }
}
