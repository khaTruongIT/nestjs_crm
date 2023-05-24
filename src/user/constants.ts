import { Prisma } from '@prisma/client';
export type Params = {
  skip?: number;
  take?: number;
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
};

export namespace TokenConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts9creteadfa9dfer134134fdavfdva9t';
  export const TOKEN_EXPIRES_IN_VALUE = '21600';
}
