import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import {
  Credentials,
  UserProfile,
  UserRequestRegister,
  securityId,
} from 'src/types';
import { emailIsValid } from 'src/utils/validate';
import { comparePassword, hashPassword } from 'src/utils/hash.password';
import _, { identity } from 'lodash';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prismaService: PrismaService) {}

  //GET USERS
  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`[users], ${JSON.stringify(params)}`);
    const users = await this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    this.logger.log(`[users], ${JSON.stringify(users)}`);
    return users;
  }

  //CREATE USER
  async createUser(data: UserRequestRegister): Promise<User> {
    this.logger.log(`[createUser] data: ${JSON.stringify(data)}`);

    const { password, email, firstName, lastName } = data;

    // check valid email
    if (!emailIsValid(email)) {
      throw new HttpException(
        {
          reason: 'Invalid email',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if user already exists
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new HttpException(
        {
          reason: 'User already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!password || password.length < 8) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    // encrypt the password
    const newPassword = await hashPassword(password);
    this.logger.log(`[createUser] password: ${newPassword}`);

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        firstName,
        lastName,
      },
    });

    this.logger.log(`[createUser] ${JSON.stringify(newUser)}`);

    const getNewUsers = await this.prismaService.user.findFirst({
      where: { email },
    });

    this.logger.log(`[createUser] newUser: ${JSON.stringify(getNewUsers)}`);

    const userCredentials = await this.prismaService.userCredentials.create({
      data: {
        userId: getNewUsers.id,
        password: newPassword,
      },
    });

    this.logger.log(
      `[createUser] userCredentials: ${JSON.stringify(userCredentials)}`,
    );

    return newUser;
  }

  //LOGIN
  async login(userCredentials: Credentials) {
    const { email, password } = userCredentials;

    const invalidCredentials = 'Invalid email or password';

    this.logger.log(`[login] userCredentials email: ${email}`);

    // Check valid of email
    if (!emailIsValid(email)) {
      throw new HttpException(invalidCredentials, HttpStatus.UNAUTHORIZED);
    }

    // found user
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      throw new HttpException(invalidCredentials, HttpStatus.UNAUTHORIZED);
    }

    const credentialFound = await this.prismaService.userCredentials.findFirst({
      where: {
        userId: user.id,
      },
    });

    this.logger.log(
      `[login] credential found: ${JSON.stringify(credentialFound)}`,
    );

    if (!credentialFound) {
      throw new HttpException(invalidCredentials, HttpStatus.UNAUTHORIZED);
    }

    const passwordMatched = await comparePassword(
      password,
      credentialFound.password,
    );

    if (!passwordMatched) {
      throw new HttpException(invalidCredentials, HttpStatus.UNAUTHORIZED);
    }

    this.logger.log(`[login], user: ${JSON.stringify(user)}`)
    
    return user;
  }

  // UPDATE USER
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prismaService.user.update({
      data,
      where,
    });
  }

  // DELETE USER
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }

  // CONVERT TO USER PROFILE
  convertToUserProfile(user: User): UserProfile {
    this.logger.log(`[convertToUserProfile], user: ${JSON.stringify(user)}`);
   
    const { email, firstName, lastName, id } = user;
    
    const userProfile: UserProfile = {
      [securityId] : id.toString(),
      email,
      firstName,
      lastName,
    }

    return userProfile
         
  }
}
