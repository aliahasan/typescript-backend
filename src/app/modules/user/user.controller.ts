import { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.services';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { student: studentData, password } = req.body;

    const result = await UserServices.createStudentToDB(password, studentData);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Student created successfully',
      data: result,
    });

    //  res.status(201).json({
    //    success: true,
    //    message: 'Student created successfully',
    //    data: result,
    //  });
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createStudent,
};
