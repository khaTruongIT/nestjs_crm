/* eslint-disable prettier/prettier */
import { Logger, Controller, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Body,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common/decorators';
import { UserRequestRegister } from 'src/types';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth.guard';
import { Credentials } from 'src/types';
import { getWinstonLogger } from 'src/logger/winston-config';

const logger = getWinstonLogger()
@Controller('auth')
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: UserRequestRegister) {
    return this.userService.createUser(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Credentials) {
    const user = await this.userService.login(signInDto)
    const userProfile = await this.userService.convertToUserProfile(user)
    logger.info(`[login] userProfile: ${JSON.stringify(userProfile)}`)
    const token = await this.authService.generateToken(userProfile)
    return {
      token, 
      userProfile
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
