import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);
router.post(
  '/change-password',
  auth('admin', 'faculty', 'student', 'superAdmin'),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthController.handleForgetPassword,
);
router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.handleResetPassword,
);

export const AuthRoutes = router;
