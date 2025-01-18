import { StatusCodes } from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDept.service';

const createAcademicDepartment = tryCatchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic department created successfully',
    data: result,
  });
});

const getAllAcademicDepartments = tryCatchAsync(async (req, res) => {
  const query = req.query;
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartments(query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic department retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleAcademicDepartment = tryCatchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentById(
      departmentId,
    );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic Department retrieved successfully',
    data: result,
  });
});

const updateAcademicDepartment = tryCatchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result = await AcademicDepartmentServices.updateAcademicDepartmentById(
    departmentId,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic Department updated successfully',
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
