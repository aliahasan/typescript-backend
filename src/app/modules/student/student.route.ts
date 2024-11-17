import express from 'express';
import {
  createStudent,
  getAllStudents,
  getSingleStudentById,
} from './student.controller';
const router = express.Router();

// will call controller function
router.post('/create-student', createStudent);
router.get('/', getAllStudents);
router.get('/:studentId', getSingleStudentById);

export const StudentRoutes = router;
