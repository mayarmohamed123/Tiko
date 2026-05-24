import { z } from 'zod';

// ─── Register: step 1 — send verification email ────────────────────────────
export const initiateRegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ─── Register: step 2 — verify token and create account ────────────────────
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

// ─── Login ──────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Forgot Password ─────────────────────────────────────────────────────────
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// ─── Reset Password ──────────────────────────────────────────────────────────
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ─── Types ───────────────────────────────────────────────────────────────────
export type InitiateRegisterInput = z.infer<typeof initiateRegisterSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
