import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import QueryBuilder from '../../Builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { courseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import Course from './course.model';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

// get all the courses
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('prerequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.queryModel;
  return result;
};

// get single course by id
const getSingleCourseById = async (id: string) => {
  const result = await Course.findById(id).populate(
    'prerequisiteCourses.course',
  );
  return result;
};

// update course by in
const updateCourseById = async (id: string, payload: Partial<TCourse>) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { prerequisiteCourses, ...remainingCourseData } = payload;

    // Step 1: Update basic course info
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      remainingCourseData,
      {
        new: true,
        runValidators: true,
        session, // Ensure session is used here
      },
    );
    if (!updatedCourse) {
      throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
    }

    // Step 2: Handle prerequisiteCourses updates
    if (prerequisiteCourses && prerequisiteCourses?.length > 0) {
      const deletedPrerequisites = prerequisiteCourses
        .filter((course) => course.course && course.isDeleted)
        .map((course) => course.course);

      const newPrerequisiteCourses = prerequisiteCourses.filter(
        (course) => course.course && !course.isDeleted,
      );

      // Remove deleted prerequisites
      if (deletedPrerequisites.length > 0) {
        await Course.findByIdAndUpdate(
          id,
          {
            $pull: {
              prerequisiteCourses: { course: { $in: deletedPrerequisites } },
            },
          },
          { session },
        );
      }

      // Add new prerequisites
      if (newPrerequisiteCourses.length > 0) {
        await Course.findByIdAndUpdate(
          id,
          {
            $addToSet: {
              prerequisiteCourses: { $each: newPrerequisiteCourses },
            },
          },
          { session },
        );
      }
    }

    // Step 3: Fetch and populate the updated course
    const result = await Course.findById(id)
      .populate('prerequisiteCourses.course')
      .session(session); // Use session here for consistency

    await session.commitTransaction(); // Commit the transaction
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction(); // Rollback on error
    session.endSession();
    throw error;
  }
};

// delete course byId

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseById,
  updateCourseById,
  deleteCourseFromDB,
};
