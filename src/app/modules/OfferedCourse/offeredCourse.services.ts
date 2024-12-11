import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../Builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDept.model';
import AcademicFaculty from '../academicFaculty/academicFaculty.model';
import Course from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import hasTimeConflict from './offeredCourse.utils';
// const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
//   const {
//     semesterRegistration,
//     academicFaculty,
//     academicDepartment,
//     faculty,
//     course,
//   } = payload;

//   // Fetch related entities in parallel
//   const [semester, facultyEntity, department, academicFac, courseEntity] =
//     await Promise.all([
//       SemesterRegistration.findById(semesterRegistration),
//       Faculty.findById(faculty),
//       AcademicDepartment.findById(academicDepartment),
//       AcademicFaculty.findById(academicFaculty),
//       Course.findById(course),
//     ]);

//   // Validate each entity
//   if (!semester) {
//     throw new AppError(
//       StatusCodes.NOT_FOUND,
//       `Semester registration not found: ${semesterRegistration}`,
//     );
//   }
//   if (!academicFac) {
//     throw new AppError(
//       StatusCodes.NOT_FOUND,
//       `Academic faculty not found: ${academicFaculty}`,
//     );
//   }
//   if (!department) {
//     throw new AppError(
//       StatusCodes.NOT_FOUND,
//       `Academic department not found: ${academicDepartment}`,
//     );
//   }
//   if (!courseEntity) {
//     throw new AppError(StatusCodes.NOT_FOUND, `Course not found: ${course}`);
//   }
//   if (!facultyEntity) {
//     throw new AppError(StatusCodes.NOT_FOUND, `Faculty not found: ${faculty}`);
//   }

//   // Prevent duplicate entries for the same semester and course
//   const existingCourse = await OfferedCourse.findOne({
//     semesterRegistration,
//     course,
//   });
//   if (existingCourse) {
//     throw new AppError(
//       StatusCodes.CONFLICT,
//       'This course is already offered for the specified semester.',
//     );
//   }
//   // Add academicSemester from semester data

//   //   check if the department is belong to the faculty
//   const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
//      academicFaculty: facultyEntity,
//    });

//    if (!isDepartmentBelongToFaculty) {
//       throw new AppError(
//          StatusCodes.FORBIDDEN,
//          'This department is not associated with the specified academic faculty.',
//       );
//    }
//    const academicSemester = semester.academicSemester;

//   // Create and return the offered course
//   const result = await OfferedCourse.create({ ...payload, academicSemester });
//   return result;
// };

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  // check if the semester registration id is exists!
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    faculty,
    course,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Semester registration not found',
    );
  }

  const academicSemester = isSemesterRegistrationExist?.academicSemester;

  const isAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Academic faculty not found');
  }
  const isAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Academic department not found');
  }
  const isCourseExist = await Course.findById(course);
  if (!isCourseExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Course is  not found');
  }
  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Faculty is  not found');
  }

  //   check if the  department is belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty: academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      `${isAcademicDepartmentExist.name} is not belong to ${isAcademicFacultyExist.name}`,
    );
  }

  //  check if the same offered course same section in same registered semester exist
  const existingCourse = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });

  if (existingCourse) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'This course is already offered for the specified semester with same section.',
    );
  }

  //   get the schedules of the  faculties
  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedules = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignSchedules, newSchedules)) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'This faculty  is not available at that time ! choose other time or day',
    );
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await offeredCourseQuery.queryModel;
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, 'Offered Course not found');
  }

  return offeredCourse;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: TOfferedCourse,
) => {};

const deleteOfferedCourseFromDB = async (id: string) => {};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
