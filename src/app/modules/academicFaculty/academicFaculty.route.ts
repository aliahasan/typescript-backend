import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { academicFacultyValidation } from './academicFacultyValidation';
const router = express.Router();

router.post(
  '/',
  validateRequest(academicFacultyValidation.academicFacultyValidationSchema),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);
router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);
router.patch(
  '/:facultyId',
  validateRequest(academicFacultyValidation.updateAcademicFacultySchema),
  AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
