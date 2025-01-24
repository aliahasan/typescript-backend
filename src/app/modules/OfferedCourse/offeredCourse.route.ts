import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { OfferedCourseValidations } from './offeredCourse.validation';

const router = express.Router();

// Static routes first
router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty'),
  OfferedCourseControllers.getAllOfferedCourses,
);
router.get(
  '/my-offered-courses',
  auth('student'),
  OfferedCourseControllers.handleGetMyOfferedCourses,
);

router.post(
  '/create-offered-course',
  auth('superAdmin', 'admin'),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

// Dynamic routes after static routes
router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  OfferedCourseControllers.getSingleOfferedCourses,
);

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  OfferedCourseControllers.deleteOfferedCourseFromDB,
);

export const offeredCourseRoutes = router;
