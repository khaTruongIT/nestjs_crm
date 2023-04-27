/* eslint-disable prettier/prettier */
import { Logger, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post } from '@nestjs/common/decorators';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup() {
    // this.logger.log('[SINGUP]');
    return 'SIGN UP';
  }

  @Post('signin')
  signin() {
    // this.logger.log('[SIGNIN]');
    return 'SIGN IN';
  }
}
