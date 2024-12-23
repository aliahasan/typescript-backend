/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
export const parseFormdata = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body?.data;
    req.body = JSON.parse(data);
    next();
  } catch (error) {
    throw new Error('failed to parse data parse data from text to json');
  }
};
