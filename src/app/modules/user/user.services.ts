/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import User from './user.model';
import { generatedStudentId } from './user.utils';

const createStudentToDB = async (password: string, payload: TStudent) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Set default password if not provided
    const userData: Partial<TUser> = {
      password: password || config.default_password,
      role: 'student',
    };

    // Find academic semester info
    const admissionSemester = await AcademicSemester.findById(
      payload.admissionSemester,
    );
    if (!admissionSemester) {
      throw new AppError(httpStatus.NOT_FOUND, 'Admission semester not found.');
    }

    // Generate student ID
    userData.id = await generatedStudentId(admissionSemester);

    // Create user
    const [newUser] = await User.create([userData], { session });
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // Associate student data with user
    payload.id = newUser.id;
    payload.user = newUser._id;

    // Create student
    const [newStudent] = await Student.create([payload], { session });
    if (!newStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const UserServices = {
  createStudentToDB,
};
