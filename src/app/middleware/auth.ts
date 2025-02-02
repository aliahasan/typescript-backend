/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { verifyToken } from '../modules/Auth/auth.utils';
import { TUserRole } from '../modules/user/user.interface';
import User from '../modules/user/user.model';
import tryCatchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return tryCatchAsync(async (req, res, next) => {
    const token = req.headers?.authorization;
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
    }
    //  check if the token is valid
    let decoded;
    try {
      decoded = verifyToken(token, config.jwt_secret as string) as JwtPayload;
    } catch (error) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { role, userId, iat } = decoded;
    const user = await User.isUserExistByCustomId(userId);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User is not found');
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
        'Password has been changed, please log in again',
      );
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'you are not authorized to access this resource',
      );
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
