import { Router } from 'express';
import validate from '../middlewares/validate.middleware.js';

import {
  register,
  verifyEmail,
  resendVerification,
  login,
  logout,
  forgotPassword,
  resetPassword,
  resendResetPassword
} from '../controllers/auth.controller.js';

import {
  registerSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendResetPasswordSchema,
} from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
authRouter.post('/resend-verification', validate(resendVerificationSchema), resendVerification);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/logout', logout);

authRouter.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
authRouter.post('/reset-password', validate(resetPasswordSchema), resetPassword);
authRouter.post('/resend-reset-password', validate(resendResetPasswordSchema), resendResetPassword);

export default authRouter;