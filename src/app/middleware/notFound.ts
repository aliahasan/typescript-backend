/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const handleNotFoundRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'API Not Found !!',
    error: `Route ${req.originalUrl} not found}`,
  });
};

export default handleNotFoundRoute;
