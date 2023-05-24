import { User, Prisma } from '@prisma/client';

export interface UserRequestRegister extends Prisma.UserCreateInput {
  password: string;
}

export type Credentials = {
  email: string;
  password: string;
};

export declare const securityId: unique symbol;
export interface Principal {
  /**
   * Name/id
   */
  [securityId]: string;
  [attribute: string]: any;
}

export interface UserProfile extends Principal {
  email: string;
  firstName: string;
  lastName: string;
}
