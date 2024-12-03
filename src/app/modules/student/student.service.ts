/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import { Student } from './student.model';
const getAllStudents = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getSingleStudent = async (id: string) => {
  //   const result = await Student.findOne({ id });
  //   const result = await Student.aggregate([{ $match: { id: id } }]);
  const result = await Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Check if the student exists
    const isExist = await Student.isStudentExist(id);
    if (!isExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }

    // Mark user as deleted
    const deleteUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { session },
    );
    if (!deleteUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to mark user as deleted',
      );
    }

    // Mark student as deleted
    const deleteStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { session },
    );
    if (!deleteStudent) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to mark student as deleted',
      );
    }
    // Commit the transaction
    await session.commitTransaction();
    return deleteStudent;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
export const StudentService = {
  getAllStudents,
  getSingleStudent,
  deleteStudentFromDB,
};
