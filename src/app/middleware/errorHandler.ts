/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import app from '../../app';
const globalErrorHandler = () => {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = 500;
    const message = err.message || 'something went wrong';
    res.status(statusCode).json({
      success: false,
      message,
      error: err,
    });
  });
};

export default globalErrorHandler;
