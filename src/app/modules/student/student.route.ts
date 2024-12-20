import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { StudentController } from './student.controller';
import { updateStudentValidationSchema } from './student.validation';
const router = express.Router();

// will call controller function
router.get('/', StudentController.getAllStudents);

router.get('/:id', StudentController.getSingleStudentById);

router.patch(
  '/:id',
  validateRequest(updateStudentValidationSchema),
  StudentController.updateStudent,
);

router.delete('/:id', StudentController.deleteStudent);
export const StudentRoutes = router;
