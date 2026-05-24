import { Request, Response } from 'express';
import prisma from '../config/db.js';
import {
  initiateRegisterSchema,
  verifyEmailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/authSchema.js';
import {
  initiateRegistration,
  verifyEmailAndActivate,
  loginUser,
  generatePasswordResetToken,
  resetPassword,
} from '../services/authService.js';

// ─── Cookie config ────────────────────────────────────────────────────────────
const COOKIE_NAME = 'auth_token';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Helper: map service errors to HTTP responses ─────────────────────────────
const handleServiceError = (res: Response, error: unknown) => {
  if (!(error instanceof Error)) {
    return res.status(500).json({ message: 'Internal server error' });
  }
  switch (error.message) {
    case 'EMAIL_TAKEN':
      return res.status(409).json({ message: 'Email is already registered.' });
    case 'TOKEN_INVALID':
      return res.status(400).json({ message: 'Invalid or expired token.' });
    case 'TOKEN_EXPIRED':
      return res.status(400).json({ message: 'Token has expired. Please request a new one.' });
    case 'ALREADY_VERIFIED':
      return res.status(400).json({ message: 'Email is already verified. You can log in.' });
    case 'INVALID_CREDENTIALS':
      return res.status(401).json({ message: 'Invalid email or password.' });
    case 'EMAIL_NOT_VERIFIED':
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    case 'ACCOUNT_DISABLED':
      return res.status(403).json({ message: 'Your account has been disabled. Contact support.' });
    default:
      console.error('[AuthController Error]', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export const initiateRegister = async (req: Request, res: Response) => {
  try {
    const data = initiateRegisterSchema.parse(req.body);
    await initiateRegistration(data);
    res.status(200).json({
      message: 'Verification email sent. Please check your inbox to complete registration.',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    handleServiceError(res, error);
  }
};

// ─── GET /api/auth/verify-email?token=xxx ────────────────────────────────────
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = verifyEmailSchema.parse({ token: req.query.token });
    await verifyEmailAndActivate(token);
    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Verification token is missing.' });
    }
    handleServiceError(res, error);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);

    // Set token exclusively in httpOnly cookie — never in response body
    res.cookie(COOKIE_NAME, result.token, cookieOptions);

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    handleServiceError(res, error);
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully.' });
};

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    await generatePasswordResetToken(email);
    // Always return the same message to prevent user enumeration
    res.status(200).json({
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    await resetPassword(token, password);
    res.status(200).json({ message: 'Password updated successfully. You can now log in.' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    handleServiceError(res, error);
  }
};

// ─── GET /api/auth/me  (protected — requires authMiddleware) ──────────────────
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
