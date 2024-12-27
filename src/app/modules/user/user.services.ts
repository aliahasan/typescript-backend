/* eslint-disable @typescript-eslint/no-explicit-any */
import StatusCodes from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sanitizeFileName, sendImageToCloudinary } from '../../utils/sendImage';
import { Admin } from '../Admin/admin.model';
import { TFaculty } from '../Faculty/faculty.interface';
import { Faculty } from '../Faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDept.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import User from './user.model';
import {
  generateAdminId,
  generatedStudentId,
  generateFacultyId,
} from './user.utils';

// create student account
const createStudentToDB = async (
  password: string,
  payload: TStudent,
  file: any,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Set default password if not provided
    const userData: Partial<TUser> = {
      password: password || (config.default_password as string),
      role: 'student',
      email: payload.email,
    };

    // Find academic semester info
    const admissionSemester = await AcademicSemester.findById(
      payload.admissionSemester,
    );
    if (!admissionSemester) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Admission semester not found.',
      );
    }

    const academicDepartment = await AcademicDepartment.findById(
      payload.academicDepartment,
    );
    if (!academicDepartment) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Academic department not found',
      );
    }

    const academicFaulty = academicDepartment.academicFaculty;

    // Generate student ID
    userData.id = await generatedStudentId(admissionSemester);

    if (file) {
      const imageName = `${userData.id}_${sanitizeFileName(payload.name.firstName)}`;
      const profileImage = await sendImageToCloudinary(imageName, file.path);
      payload.profileImage = profileImage;
    }

    // Create user
    const [newUser] = await User.create([userData], { session });
    if (!newUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    // Associate student data with user
    payload.id = newUser.id;
    payload.user = newUser._id;
    payload.academicFaculty = academicFaulty;

    // Create student
    const [newStudent] = await Student.create([payload], { session });
    if (!newStudent) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'An error occurred',
    );
  } finally {
    await session.endSession();
  }
};

// create faculty(teacher) account
const createFacultyIntoDB = async (
  password: string,
  payload: TFaculty,
  file: any,
) => {
  //create a user object
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);

  // set student role and email
  userData.role = 'faculty';
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Academic department not found.');
  }
  const academicFaculty = academicDepartment.academicFaculty;

  //   start session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //set generated id
    userData.id = await generateFacultyId();

    if (file) {
      const imageName = `${userData.id}_${sanitizeFileName(payload.name.firstName)}`;
      const profileImage = await sendImageToCloudinary(imageName, file?.path);
      payload.profileImage = profileImage;
      payload.profileImage = profileImage;
    }

    //create a user (transaction -1)
    const newUser = await User.create([userData], { session }); //return an array
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    payload.academicFaculty = academicFaculty;

    //create a faculty (transaction -2)
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create faculty');
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// create admin account
const createAdminIntoDB = async (
  password: string,
  payload: TFaculty,
  file: any,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    if (file) {
      const imageName = `${userData.id}_${sanitizeFileName(payload.name.firstName)}`;
      const profileImage = await sendImageToCloudinary(imageName, file.path);
      payload.profileImage = profileImage;
      payload.profileImage = profileImage;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// get me (all the users of the application)
const getMe = async (payload: JwtPayload) => {
  const { userId, role } = payload;
  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  return result;
};

// change user status by admin | superAdmin
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return result;
};

export const UserServices = {
  createStudentToDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
