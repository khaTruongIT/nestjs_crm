import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

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
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    this.logger.log(`[createUser] data: ${JSON.stringify(data)}`);
    
    const user = await this.prismaService.user.create({
      data,
    });
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
}
