import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import { TLoginUser } from './auth.interface';

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
  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: '365d',
  });
  return {
    accessToken,
    needPasswordChange: user?.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
