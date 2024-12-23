import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { parseFormdata } from '../../utils/fileUpload';
import { upload } from '../../utils/sendImage';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { studentValidations } from '../student/student.validation';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { userValidation } from './user.validation';
const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  parseFormdata,
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.handleCreateStudent,
);

router.post(
  '/create-faculty',
  auth('admin'),
  validateRequest(createFacultyValidationSchema),
  UserControllers.handleCreateFaculty,
);

router.post(
  '/create-admin',
  //   auth('admin'),
  validateRequest(createAdminValidationSchema),
  UserControllers.handleCreateAdmin,
);

router.get(
  '/me',
  auth('student', 'faculty', 'admin'),
  UserControllers.handleGetMe,
);

router.patch(
  '/change-status/:id',
  auth('admin'),
  validateRequest(userValidation.changeStatusValidationSchema),
  UserControllers.handleChangeStatus,
);

export const UserRoutes = router;
