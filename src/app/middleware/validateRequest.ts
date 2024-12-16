import { NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import tryCatchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return tryCatchAsync(async (req, res, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
    });
    next();
  });
};

export default validateRequest;
