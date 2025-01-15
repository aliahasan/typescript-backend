import { StatusCodes } from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.services';

const createAcademicSemester = tryCatchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic semester created successfully',
    data: result,
  });
});

const getAllAcademicSemesters = tryCatchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemesters(
    req.query,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic semesters retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAcademicSemester = tryCatchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterById(semesterId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic semester retrieved successfully',
    data: result,
  });
});

const updateAcademicSemester = tryCatchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await AcademicSemesterServices.updateAcademicSemesterById(
    semesterId,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic semester updated successfully',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
