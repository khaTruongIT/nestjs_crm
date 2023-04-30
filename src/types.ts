import { User, Prisma } from '@prisma/client';

export interface UserRequestRegister extends Prisma.UserCreateInput {
  password: string
};
