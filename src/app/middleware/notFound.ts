/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';

const handleNotFoundRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Api not found!`,
  });
};

export default handleNotFoundRoute;
