import { StatusCodes } from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrollCourseServices } from './enrolledCourse.service';

const handleCreateEnrolledCourse = tryCatchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await enrollCourseServices.createEnrolledCourse(
    userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student Enrollment successfully completed',
    data: result,
  });
});

const handleUpdateEnrolledCourseMarks = tryCatchAsync(async (req, res) => {
  const facultyId = req.user.userId;
  const result = await enrollCourseServices.updateEnrolledCourseMarks(
    facultyId,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Marks updated successfully',
    data: result,
  });
});

export const EnrollCourseControllers = {
  handleCreateEnrolledCourse,
  handleUpdateEnrolledCourseMarks,
};
