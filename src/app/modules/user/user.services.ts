/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import User from './user.model';

const createStudentToDB = async (password: string, studentData: TStudent) => {
  try {
    const userData: Partial<TUser> = {};
    userData.password = password || (config.default_password as string);
    userData.role = 'student';
    userData.id = '203010001';

    const newUser = await User.create(userData);

    if (Object.keys(newUser).length) {
      studentData.id = newUser.id;
      studentData.user = newUser._id;

      const newStudent = await Student.create(studentData);
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
