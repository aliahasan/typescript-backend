import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { FacultyControllers } from './faculty.controller';
import { updateFacultyValidationSchema } from './faculty.validation';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, 'superAdmin'),
  FacultyControllers.getAllFaculties,
);
router.get(
  '/:id',
  auth('faculty', 'admin', 'superAdmin'),
  FacultyControllers.getSingleFaculty,
);

router.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete(
  '/:id',
  auth('admin', 'superAdmin'),
  FacultyControllers.deleteFaculty,
);

export const FacultyRoutes = router;
