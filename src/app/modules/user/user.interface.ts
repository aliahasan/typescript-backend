/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  email: string;
  password: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'student' | 'faculty' | 'super-admin';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTissuedBeforePasswordChange(
    passwordChangedAt: Date,
    jwtTimestamp: number,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
