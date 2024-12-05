import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TAcademicDepartment } from './academicDept.interface';
import { AcademicDepartment } from './academicDept.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartments = async () => {
  const result = await AcademicDepartment.find().populate('academicFaculty');
  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No academic departments found');
  }
  return result;
};

const getSingleAcademicDepartmentById = async (id: string) => {
  const result =
    await AcademicDepartment.findById(id).populate('academicFaculty');
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Could not find any academic department',
    );
  }
  return result;
};

const updateAcademicDepartmentById = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartments,
  getSingleAcademicDepartmentById,
  updateAcademicDepartmentById,
};
