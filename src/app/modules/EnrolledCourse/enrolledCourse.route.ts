import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { EnrollCourseControllers } from './enrolledCourse.controller';
import { EnrolledCourseValidations } from './enrolledCourse.validation';

const router = Router();

router.post(
  '/create-enrolled-course',
  auth('student'),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrollCourseControllers.handleCreateEnrolledCourse,
);

router.get(
  '/my-enrolled-courses',
  auth('student'),
  EnrollCourseControllers.handleMyEnrolledCourses,
);

router.patch(
  '/update-enrolled-course-marks',
  auth('faculty', 'admin', 'superAdmin'),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
  ),
  EnrollCourseControllers.handleUpdateEnrolledCourseMarks,
);
export const enrolledCourseRoutes = router;
