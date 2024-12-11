import { StatusCodes } from 'http-status-codes';
import { default as tryCatchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.services';

const createOfferedCourse = tryCatchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Course is created successfully !',
    data: result,
  });
});

const getAllOfferedCourses = tryCatchAsync(async (req, res) => {
  //   const result =
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'OfferedCourses retrieved successfully !',
  //     data: result,
  //   });
});

const getSingleOfferedCourses = tryCatchAsync(async (req, res) => {
  //   const result =
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'OfferedCourse fetched successfully',
  //     data: result,
  //   });
});

const updateOfferedCourse = tryCatchAsync(async (req, res) => {
  //   sendResponse(res, {
  //     statusCode: StatusCodes.OK,
  //     success: true,
  //     message: 'OfferedCourse updated successfully',
  //     data: result,
  //   });
});

const deleteOfferedCourseFromDB = tryCatchAsync(async (req, res) => {
  //  sendResponse(res, {
  //    statusCode: StatusCodes.OK,
  //    success: true,
  //    message: 'OfferedCourse deleted successfully',
  //    data: result,
  //  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourses,
  updateOfferedCourse,
  deleteOfferedCourseFromDB,
};
