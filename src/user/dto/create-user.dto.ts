import { User, Prisma } from '@prisma/client';
import {IsEmail, IsNotEmpty, IsString, MinLength, MaxLength} from 'class-validator'

export class CreateUserDto  {
  @IsEmail() 
  @IsString()	
  @IsNotEmpty()
  email: string

  @IsString()
  firstName?: string 

  @IsString()
  lastName?: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string
}