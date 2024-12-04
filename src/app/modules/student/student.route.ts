import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { StudentController } from './student.controller';
import { updateStudentValidationSchema } from './student.validation';
const router = express.Router();

// will call controller function
router.get('/', StudentController.getAllStudents);

router.get('/:studentId', StudentController.getSingleStudentById);

router.patch(
  '/:studentId',
  validateRequest(updateStudentValidationSchema),
  StudentController.updateStudent,
);

router.delete('/:studentId', StudentController.deleteStudent);
export const StudentRoutes = router;
