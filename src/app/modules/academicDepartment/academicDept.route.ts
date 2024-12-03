import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicDepartmentControllers } from './academicDept.controller';
import { academicDepartmentValidation } from './academicDept.validation';
const router = express.Router();

router.post(
  '/',
  validateRequest(
    academicDepartmentValidation.academicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);
router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getSingleAcademicDepartment,
);
router.patch(
  '/:departmentId',
  validateRequest(academicDepartmentValidation.updateAcademicDepartmentSchema),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
