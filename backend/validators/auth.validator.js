import { z } from 'zod';

// Register
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

// Verify Email
export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    code: z.string().length(6, 'Verification code must be 6 digits'),
  }),
});

// Resend Verification
export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
  }),
});

// Login
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Forgot Password
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
  }),
});

// Reset Password
export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    code: z.string().length(6, 'Reset code must be 6 digits'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

// Resend Reset Password
export const resendResetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
  }),
});
