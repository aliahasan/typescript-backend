import httpStatus from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

const createCourse = tryCatchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

const getAllCourses = tryCatchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses are retrieved successfully',
    data: result,
  });
});

const getSingleCourse = tryCatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrieved successfully',
    data: result,
  });
});

const updateCourse = tryCatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseById(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is updated successfully',
    data: result,
  });
});

const deleteCourse = tryCatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course  deleted successfully',
    data: result,
  });
});

// assign faculties
const assignFacultiesWithCourse = tryCatchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties assigned successfully',
    data: result,
  });
});

// get faculties associated with a course
const getFacultiesWithCourse = tryCatchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getFacultiesWithCourseById(courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties associated with the course are retrieved successfully',
    data: result,
  });
});

// remove faculties from course
const removeFacultiesFromCourse = tryCatchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFacultiesFromCourseFormDB(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties removed successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse,
  getFacultiesWithCourse,
};
