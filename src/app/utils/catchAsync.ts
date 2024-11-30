import { NextFunction, Request, RequestHandler, Response } from 'express';
// handle async function to avoid try catch by higher order functions
const tryCatchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default tryCatchAsync;
