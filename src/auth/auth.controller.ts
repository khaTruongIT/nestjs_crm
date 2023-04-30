/* eslint-disable prettier/prettier */
import { Logger, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Post } from '@nestjs/common/decorators';
import { UserRequestRegister } from 'src/types';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: UserRequestRegister) {
    this.logger.log(`[SIGNUP], Start SIGN UP`);
    return this.userService.createUser(createUserDto);
  }

  @Post('signin')
  signin() {
    // this.logger.log('[SIGNIN]');
    return 'SIGN IN';
  }
}
