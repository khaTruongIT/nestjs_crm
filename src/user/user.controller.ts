import { Controller, Get, Param } from '@nestjs/common';
import { Params } from './constants';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async findAll(@Param() params: Params): Promise<User[]> {
    const users = await this.userService.getUsers(params);
    return users;
  }
}
