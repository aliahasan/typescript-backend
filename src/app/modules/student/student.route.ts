import express from 'express';
import { StudentController } from './student.controller';
const router = express.Router();

// will call controller function
router.get('/', StudentController.getAllStudents);
router.get('/:studentId', StudentController.getSingleStudentById);
router.delete('/update/:studentId', StudentController.deleteStudent);

export const StudentRoutes = router;
