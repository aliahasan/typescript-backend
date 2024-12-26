/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import QueryBuilder from '../../Builders/QueryBuilder';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import { studentSearchableFields } from './students.constant';

// const getAllStudents = async (query: Record<string, unknown>) => {
//   // Extracting specific query fields
//   const { searchTerm, sort, page, limit, fields, ...filters } = query;

//   // Building search query for partial matches
//   const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
//   const searchFilter = searchTerm
//     ? {
//         $or: studentSearchableFields.map((field) => ({
//           [field]: { $regex: searchTerm, $options: 'i' },
//         })),
//       }
//     : {};

//   // Merging filters with search query
//   const queryFilters = {
//     $and: [filters, searchFilter],
//   };

//   // Sorting
//   const sortBy = sort ? (sort as string) : '-createdAt';

//   // Pagination defaults
//   const pageNumber = Number(page) || 1;
//   const limitNumber = Number(limit) || 10;
//   const skip = (pageNumber - 1) * limitNumber;

//   // Field selection----fields limiting
//   const selectedFields = fields
//     ? (fields as string).split(',').join(' ')
//     : '-__v';

//   // Query execution
//   const students = await Student.find(queryFilters)
//     .populate('admissionSemester')
//     .populate({
//       path: 'academicDepartment',
//       populate: {
//         path: 'academicFaculty',
//       },
//     })
//     .sort(sortBy)
//     .skip(skip)
//     .limit(limitNumber)
//     .select(selectedFields);

//   return students;
// };

const getAllStudents = async (query: Record<string, unknown>) => {
  const studentsQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await studentsQuery.queryModel;
  const meta = await studentsQuery.countTotal();
  return {
    meta,
    result,
  };
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
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Could not find any student');
  }
  return result;
};

const updateStudentById = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardians, localGuardians, ...remainingStudentData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardians && Object.keys(guardians).length) {
    for (const [key, value] of Object.entries(guardians)) {
      modifiedUpdatedData[`guardians.${key}`] = value;
    }
  }
  if (localGuardians && Object.keys(localGuardians).length) {
    for (const [key, value] of Object.entries(localGuardians)) {
      modifiedUpdatedData[`localGuardians.${key}`] = value;
    }
  }
  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

// delete user and student from database
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
    const deleteUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { session },
    );
    if (!deleteUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to mark user as deleted',
      );
    }

    const userId = deleteUser.id;

    // Mark student as deleted
    const deleteStudent = await Student.findByIdAndUpdate(
      userId,
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
  updateStudentById,
  deleteStudentFromDB,
};
