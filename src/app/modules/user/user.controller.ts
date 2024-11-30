import StatusCodes from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.services';

const createStudent = tryCatchAsync(async (req, res) => {
  const { student: studentData, password } = req.body;
  const result = await UserServices.createStudentToDB(password, studentData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
