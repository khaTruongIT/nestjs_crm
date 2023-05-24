import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenConstants } from 'src/user/constants';

@Module({
  controllers: [AuthController],
  providers: [ UserService, PrismaService, AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: TokenConstants.TOKEN_SECRET_VALUE,
      signOptions: { expiresIn: TokenConstants.TOKEN_EXPIRES_IN_VALUE },
    }),
  ],
})
export class AuthModule {}
