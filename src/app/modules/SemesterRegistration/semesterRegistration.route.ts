import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = express.Router();

// create
router.post(
  '/create-semester-registration',
  auth('admin', 'superAdmin'),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/',
  auth('admin', 'superAdmin', 'faculty', 'student'),
  SemesterRegistrationControllers.getAllSemesterRegistration,
);

router.get(
  '/:id',
  auth('admin', 'superAdmin', 'faculty', 'student'),
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);

router.delete(
  '/:id',
  auth('admin', 'superAdmin'),
  SemesterRegistrationControllers.deleteSemesterRegistration,
);
export const semesterRegistrationRoutes = router;
