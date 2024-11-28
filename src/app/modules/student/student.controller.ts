import { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { StudentService } from './student.service';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentService.getAllStudents();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Students retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getSingleStudent(studentId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Student retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.deleteStudentFromDB(studentId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Student deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const StudentController = {
  getAllStudents,
  getSingleStudentById,
  deleteStudent,
};
