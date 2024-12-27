import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  auth('admin', 'superAdmin'),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.get(
  '/:courseId/get-faculties',
  auth('admin', 'superAdmin', 'student', 'faculty'),
  CourseControllers.getFacultiesWithCourse,
);

router.get('/', CourseControllers.getAllCourses);

router.get(
  '/:id',
  auth('student', 'faculty', 'admin', 'superAdmin'),
  CourseControllers.getSingleCourse,
);

router.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete(
  '/:id',
  auth('admin', 'superAdmin'),
  CourseControllers.deleteCourse,
);

// assign faculties to the courses
router.put(
  '/:courseId/assign-faculties',
  auth('admin', 'superAdmin'),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);

// remove faculties from Courses
router.delete(
  '/:courseId/remove-faculties',
  auth('admin', 'superAdmin'),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
