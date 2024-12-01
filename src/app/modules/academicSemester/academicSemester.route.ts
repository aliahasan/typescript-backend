import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicSemesterControllers } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';
const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);
// // will call controller function
// router.get('/', StudentController.getAllStudents);
// router.get('/:studentId', StudentController.getSingleStudentById);
// router.delete('/update/:studentId', StudentController.deleteStudent);

export const AcademicSemesterRoutes = router;
