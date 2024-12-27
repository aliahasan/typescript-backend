import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { StudentController } from './student.controller';
import { updateStudentValidationSchema } from './student.validation';
const router = express.Router();

router.get('/', auth('admin', 'superAdmin'), StudentController.getAllStudents);

router.get(
  '/:id',
  auth('student', 'faculty', 'admin', 'superAdmin'),
  StudentController.getSingleStudentById,
);

router.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  validateRequest(updateStudentValidationSchema),
  StudentController.updateStudent,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  StudentController.deleteStudent,
);
export const StudentRoutes = router;
