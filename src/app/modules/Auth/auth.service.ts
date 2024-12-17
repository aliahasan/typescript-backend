import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistByCustomId(payload.id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid ID or password');
  }
  if (user.status === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked');
  }
  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is deleted');
  }
  const checkedPassword = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  );
  if (!checkedPassword) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Invalid ID or password');
  }

  //   create token and sent to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.jwt_secret_expires as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_secret_expires as string,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user?.needPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistByCustomId(userData?.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid ID or password');
  }
  if (user.status === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked');
  }
  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is deleted');
  }
  const checkedPassword = await User.isPasswordMatched(
    payload?.oldPassword,
    user?.password,
  );
  if (!checkedPassword) {
    throw new AppError(StatusCodes.FORBIDDEN, 'password does not match');
  }

  //   hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData?.userId,
      role: userData?.role,
    },
    {
      password: newHashedPassword,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

const refreshToken = async (token: string) => {
  //  check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  const { userId, iat } = decoded;
  const user = await User.isUserExistByCustomId(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid ID or password');
  }
  if (user.status === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked');
  }
  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is deleted');
  }

  if (
    user?.passwordChangedAt &&
    (await User.isJWTissuedBeforePasswordChange(
      user.passwordChangedAt,
      iat as number,
    ))
  ) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'you are unauthorized, please log in again',
    );
  }

  //   create new token and sent to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.jwt_secret_expires as string,
  );
  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};
