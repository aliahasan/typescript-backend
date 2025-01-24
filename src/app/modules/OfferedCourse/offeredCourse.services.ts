import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../Builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDept.model';
import AcademicFaculty from '../academicFaculty/academicFaculty.model';
import Course from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model';
import { Student } from '../student/student.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import hasTimeConflict from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
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
  const meta = await offeredCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get my offered courses
const getMyOfferedCourses = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  //pagination setup
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const student = await Student.findOne({ id: userId });
  if (!student) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student is not found');
  }
  //  find current ongoing semester
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  );
  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'There is no ongoing semester registration!',
    );
  }
  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ['$course.prerequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.prerequisiteCourses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ];
  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];
  const result = await OfferedCourse.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);
  const total = (await OfferedCourse.aggregate(aggregationQuery)).length;

  const totalPage = Math.ceil(result.length / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
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
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;
  const isOfferedCourseExist = await OfferedCourse.findById(id);

  if (!isOfferedCourseExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Offered Course not found');
  }
  const isFacultyExist = await Faculty.findById(faculty);

  if (!isFacultyExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found');
  }
  const semesterRegistration = isOfferedCourseExist?.semesterRegistration;

  const semesterRegistrationStats =
    await SemesterRegistration.findById(semesterRegistration);
  if (semesterRegistrationStats?.status !== 'UPCOMING') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `you can not update this offered code as it is ${semesterRegistrationStats?.status}`,
    );
  }

  SemesterRegistration.findById(semesterRegistration);
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
      'This faculty  is not available at that time! choose other time or day',
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  const isOfferedCourseExist = await OfferedCourse.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'offered course not found');
  }
  const semesterRegistration = isOfferedCourseExist?.semesterRegistration;
  const semesterRegistrationStats =
    await SemesterRegistration.findById(semesterRegistration).select('status');
  if (semesterRegistrationStats?.status !== 'UPCOMING') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `you can not delete this offered code as it is ${semesterRegistrationStats?.status}`,
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(id);
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  getMyOfferedCourses,
};

// //pagination setup
// const page = Number(query?.page) || 1;
// const limit = Number(query?.limit) || 10;
// const skip = (page - 1) * limit;

// const student = await Student.findOne({ id: userId });
// if (!student) {
//   throw new AppError(StatusCodes.NOT_FOUND, 'Student is not found');
// }
// //  find current ongoing semester
// const currentOngoingRegistrationSemester = await SemesterRegistration.findOne({
//   status: 'ONGOING',
// });
// if (!currentOngoingRegistrationSemester) {
//   throw new AppError(
//     StatusCodes.NOT_FOUND,
//     'There is no ongoing semester registration!',
//   );
// }
// const aggregationQuery = [
//   {
//     $match: {
//       semesterRegistration: currentOngoingRegistrationSemester?._id,
//       academicFaculty: student.academicFaculty,
//       academicDepartment: student.academicDepartment,
//     },
//   },
//   {
//     $lookup: {
//       from: 'courses',
//       localField: 'course',
//       foreignField: '_id',
//       as: 'course',
//     },
//   },
//   {
//     $unwind: '$course',
//   },
//   {
//     $lookup: {
//       from: 'enrolledcourses',
//       let: {
//         currentOngoingRegistrationSemester:
//           currentOngoingRegistrationSemester._id,
//         currentStudent: student._id,
//       },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 {
//                   $eq: [
//                     '$semesterRegistration',
//                     '$$currentOngoingRegistrationSemester',
//                   ],
//                 },
//                 {
//                   $eq: ['$student', '$$currentStudent'],
//                 },
//                 {
//                   $eq: ['$isEnrolled', true],
//                 },
//               ],
//             },
//           },
//         },
//       ],
//       as: 'enrolledCourses',
//     },
//   },
//   {
//     $lookup: {
//       from: 'enrolledcourses',
//       let: {
//         currentStudent: student._id,
//       },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 {
//                   $eq: ['$student', '$$currentStudent'],
//                 },
//                 {
//                   $eq: ['$isCompleted', true],
//                 },
//               ],
//             },
//           },
//         },
//       ],
//       as: 'completedCourses',
//     },
//   },
//   {
//     $addFields: {
//       completedCourseIds: {
//         $map: {
//           input: '$completedCourses',
//           as: 'completed',
//           in: '$$completed.course',
//         },
//       },
//     },
//   },
//   {
//     $addFields: {
//       isPreRequisitesFulFilled: {
//         $or: [
//           { $eq: ['$course.prerequisiteCourses', []] },
//           {
//             $setIsSubset: [
//               '$course.prerequisiteCourses.course',
//               '$completedCourseIds',
//             ],
//           },
//         ],
//       },
//       isAlreadyEnrolled: {
//         $in: [
//           '$course._id',
//           {
//             $map: {
//               input: '$enrolledCourses',
//               as: 'enroll',
//               in: '$$enroll.course',
//             },
//           },
//         ],
//       },
//     },
//   },
//   {
//     $match: {
//       isAlreadyEnrolled: false,
//       isPreRequisitesFulFilled: true,
//     },
//   },
// ];
// const paginationQuery = [
//   {
//     $skip: skip,
//   },
//   {
//     $limit: limit,
//   },
// ];
// const result = await OfferedCourse.aggregate([
//   ...aggregationQuery,
//   ...paginationQuery,
// ]);
// const total = (await OfferedCourse.aggregate(aggregationQuery)).length;

// const totalPage = Math.ceil(result.length / limit);

// return {
//   meta: {
//     page,
//     limit,
//     total,
//     totalPage,
//   },
//   result,
// };
