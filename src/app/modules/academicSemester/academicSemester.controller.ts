import StatusCodes from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createAcademicSemesterServices } from './academicSemester.services';

const createAcademicSemester = tryCatchAsync(async (req, res) => {
  const result =
    await createAcademicSemesterServices.createAcademicSemesterIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic semester created successfully',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
};
