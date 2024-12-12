/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TSchedule } from './offeredCourse.interface';

const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    // 10:30 - 12:30
    // 11:30 - 1.30
    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};
export default hasTimeConflict;

export const validateExistence = async (
  model: any,
  id: mongoose.Types.ObjectId,
  entityName: string,
) => {
  const entity = await model.findById(id);
  if (!entity) {
    throw new AppError(StatusCodes.NOT_FOUND, `${entityName} not found`);
  }
  return entity;
};

// const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
//    // check if the semester registration id is exists!
//    const {
//      semesterRegistration,
//      academicFaculty,
//      academicDepartment,
//      faculty,
//      course,
//      section,
//      days,
//      startTime,
//      endTime,
//    } = payload;

//    //   validate existence of entities
//    const [
//      isSemesterRegistrationExist,
//      isAcademicFacultyExist,
//      isAcademicDepartmentExist,
//      isCourseExist,
//      isFacultyExist,
//    ] = await Promise.all([
//      validateExistence(
//        SemesterRegistration,
//        semesterRegistration,
//        'Semester registration',
//      ),
//      validateExistence(AcademicFaculty, academicFaculty, 'Academic faculty'),
//      validateExistence(
//        AcademicDepartment,
//        academicDepartment,
//        'Academic department',
//      ),
//      validateExistence(Course, course, 'Course'),
//      validateExistence(Faculty, faculty, 'Faculty'),
//    ]);

//    const existingCourse = await OfferedCourse.findOne({
//      semesterRegistration,
//      course,
//      section,
//    });
//    if (existingCourse) {
//      throw new AppError(
//        StatusCodes.CONFLICT,
//        'This course is already offered for the specified semester with the same section.',
//      );
//    }

//    // Validate faculty schedule
//    const assignSchedules = await OfferedCourse.find({
//      semesterRegistration,
//      faculty,
//      days: { $in: days },
//    }).select('days startTime endTime');

//    const newSchedules = { days, startTime, endTime };
//    if (hasTimeConflict(assignSchedules, newSchedules)) {
//      throw new AppError(
//        StatusCodes.CONFLICT,
//        'This faculty is not available at the chosen time or day. Please choose another time or day.',
//      );
//    }

//    // Add academic semester to payload
//    const academicSemester = isSemesterRegistrationExist?.academicSemester;

//    // Create offered course
//    const result = await OfferedCourse.create({ ...payload, academicSemester });
//    return result;
//  };
