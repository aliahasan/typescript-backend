import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import Course from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model';
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model';
import { Student } from '../student/student.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate offered course existence and capacity
    const offeredCourse = await OfferedCourse.findById(payload.offeredCourse);
    if (!offeredCourse) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Offered course not found');
    }

    if (offeredCourse.maxCapacity <= 0) {
      throw new AppError(StatusCodes.CONFLICT, 'Offered course is full');
    }

    // Validate student existence
    const student = await Student.findOne({ id: userId }, { _id: 1 });
    if (!student) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Student not found');
    }

    // Check for existing enrollment
    const isAlreadyEnrolled = await EnrolledCourse.findOne({
      semesterRegistration: offeredCourse.semesterRegistration,
      offeredCourse: payload.offeredCourse,
      student: student._id,
    });

    if (isAlreadyEnrolled) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'Student is already enrolled in this offered course',
      );
    }
    const course = await Course.findById(offeredCourse.course).select(
      'credits',
    );
    const currentCredit = course?.credits;
    const semesterRegistration = await SemesterRegistration.findById(
      offeredCourse.semesterRegistration,
    ).select('maxCredit');
    const maxCredit = semesterRegistration?.maxCredit;

    const enrolledCourses = await EnrolledCourse.aggregate([
      {
        $match: {
          semesterRegistration: offeredCourse.semesterRegistration,
          student: student._id,
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'enteredCourseData',
        },
      },
      {
        $unwind: '$enteredCourseData',
      },
      {
        $group: {
          _id: null,
          totalEnrolledCredits: { $sum: '$enteredCourseData.credits' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    //   total enrolled credits + new enrolled course credit > maxCredit
    const totalCredits =
      enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
    if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'You have exceeded the maximum credit limit',
      );
    }
    //   Populate payload with necessary data
    Object.assign(payload, {
      semesterRegistration: offeredCourse.semesterRegistration,
      academicSemester: offeredCourse.academicSemester,
      academicFaculty: offeredCourse.academicFaculty,
      academicDepartment: offeredCourse.academicDepartment,
      offeredCourse: payload.offeredCourse,
      course: offeredCourse.course,
      student: student._id,
      faculty: offeredCourse.faculty,
      isEnrolled: true,
    });

    // Create enrolled course record
    const result = await EnrolledCourse.create([payload], { session });
    if (!result) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to create enrolled course',
      );
    }

    // Update offered course capacity
    offeredCourse.maxCapacity -= 1;
    await offeredCourse.save({ session });

    // Commit transaction
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const updateEnrolledCourseMarks = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Semester registration not found !',
    );
  }
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Offered course not found !');
  }
  const isStudentExists = await Student.findById(student);

  if (!isStudentExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found !');
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found !');
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });
  if (!isCourseBelongToFaculty) {
    throw new AppError(StatusCodes.FORBIDDEN, 'You are forbidden! !');
  }
  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }
  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  );
  return result;
};

export const enrollCourseServices = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
