/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import User from './user.model';
import { generatedStudentId } from './user.utils';

const createStudentToDB = async (password: string, payload: TStudent) => {
  try {
    const userData: Partial<TUser> = {};
    userData.password = password || (config.default_password as string);
    userData.role = 'student';

    // Find academic semester info
    const admissionSemester = await AcademicSemester.findById(
      payload.admissionSemester,
    );

    if (!admissionSemester) {
      throw new Error('Admission semester not found.');
    }

    // Generate student ID using the found academic semester
    userData.id = generatedStudentId(admissionSemester);

    const newUser = await User.create(userData);

    if (Object.keys(newUser).length) {
      payload.id = newUser.id;
      payload.user = newUser._id;

      const newStudent = await Student.create(payload);
      return newStudent;
    }

    throw new Error('Failed to create user.');
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UserServices = {
  createStudentToDB,
};
