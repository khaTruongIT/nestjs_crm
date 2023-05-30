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
  [attribute: string]: any;
}
export interface UserProfile extends Principal {
  id: number
  email: string;
  firstName: string;
  lastName: string;
}

// export interface UserProfile extends Principal {
//   email?: string;
//   name?: string;
// }
