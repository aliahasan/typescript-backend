/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { handleMongooseValidationError } from '../errors/mongoose.error';
import { handleZodError } from '../errors/zod.error';
import { TErrorSources } from '../interface/error';

// Global error handler middleware
const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next: NextFunction,
) => {
  //setting default values of error handler
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Internal Server Error',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err.stack : null,
  });
};

export default globalErrorHandler;
