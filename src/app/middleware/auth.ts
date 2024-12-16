import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import tryCatchAsync from '../utils/catchAsync';

const auth = () => {
  return tryCatchAsync(async (req, res, next) => {
    const token = req.headers?.authorization;
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
    }
    //  check if the token is valid
    jwt.verify(token, config.jwt_secret as string, (err, decoded) => {
      if (err) {
        throw new AppError(StatusCodes.FORBIDDEN, 'you are not authenticated');
      }
      req.user = decoded as JwtPayload;
      next();
    });
  });
};

export default auth;
