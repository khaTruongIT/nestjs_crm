import { Logger, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { sign } from 'crypto';
import { CustomLogger } from 'src/logger/logger.service';
import { UserProfile, securityId } from 'src/types';
import { TokenConstants } from 'src/user/constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private logger: CustomLogger,
  ) {}

  // generate token
  async generateToken(userProfile: UserProfile) {
    this.logger.log(
      `[generateToken] userProfile: ${JSON.stringify(userProfile)}`,
    );

    // check user profile
    if (!userProfile) {
      throw new HttpException(
        'Error generating token : userProfile is null',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { id, email, lastName, firstName } = userProfile;

    const userProfileForToken = {
      email,
      name: `${firstName} ${lastName}`,
    };
    let token: string;

    try {
      token = this.jwtService.sign(userProfileForToken, {
        secret: TokenConstants.TOKEN_SECRET_VALUE,
        expiresIn: TokenConstants.TOKEN_EXPIRES_IN_VALUE,
      });
    } catch (err) {
      this.logger.error(`[generateToken] Error: ${JSON.stringify(err)}`);
      return err;
    }
    return token;
  }
}
