import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import type {
  InitiateRegisterInput,
  LoginInput,
} from '../schemas/authSchema.js';

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'supersecret')) {
  throw new Error('FATAL: JWT_SECRET environment variable must be configured in production and cannot be the default fallback value.');
}
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ─── Helper ───────────────────────────────────────────────────────────────────
const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

// ─── Phase 4.1 — Initiate Registration ───────────────────────────────────────
export const initiateRegistration = async (data: InitiateRegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });

  if (existing) {
    // If already verified, reject. If pending, resend verification.
    if (existing.isVerified) {
      throw new Error('EMAIL_TAKEN');
    }
    // Resend: regenerate token for unverified user
    const token = crypto.randomBytes(64).toString('hex');
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { email: data.email },
      data: {
        verificationToken: token,
        verificationExpiry: expiry,
      },
    });

    await sendVerificationEmail(existing.email, existing.fullName, token);
    return;
  }

  // New user — hash password and store as unverified
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const token = crypto.randomBytes(64).toString('hex');
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      phone: data.phone ?? null,
      address: data.address ?? null,
      isVerified: false,
      verificationToken: token,
      verificationExpiry: expiry,
    },
  });

  await sendVerificationEmail(data.email, data.fullName, token);
};

// ─── Phase 4.2 — Verify Email & Activate Account ─────────────────────────────
export const verifyEmailAndActivate = async (token: string) => {
  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  });

  if (!user) throw new Error('TOKEN_INVALID');
  if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
    throw new Error('TOKEN_EXPIRED');
  }
  if (user.isVerified) throw new Error('ALREADY_VERIFIED');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpiry: null,
    },
  });

  // Create commerce profile for shoppers (non-admin accounts)
  if (user.role !== 'ADMIN') {
    const existingCustomer = await prisma.customer.findFirst({
      where: { userId: user.id, deletedAt: null },
    });
    if (!existingCustomer) {
      await prisma.customer.create({
        data: {
          userId: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          defaultAddress: user.address,
        },
      });
    }
  }
};

// ─── Phase 4.3 — Login ────────────────────────────────────────────────────────
export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  // Use a generic message to prevent user enumeration
  if (!user) throw new Error('INVALID_CREDENTIALS');

  if (!user.isActive) throw new Error('ACCOUNT_DISABLED');

  if (!user.isVerified) throw new Error('EMAIL_NOT_VERIFIED');

  const passwordMatch = await bcrypt.compare(data.password, user.password);
  if (!passwordMatch) throw new Error('INVALID_CREDENTIALS');

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  };
};

// ─── Phase 4.4 — Forgot Password ──────────────────────────────────────────────
export const generatePasswordResetToken = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent user enumeration
  if (!user || !user.isVerified) return;

  const rawToken = crypto.randomBytes(64).toString('hex');
  const hashedToken = hashToken(rawToken);
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpiry: expiry,
    },
  });

  await sendPasswordResetEmail(user.email, user.fullName, rawToken);
};

// ─── Phase 4.5 — Reset Password ───────────────────────────────────────────────
export const resetPassword = async (rawToken: string, newPassword: string) => {
  const hashedToken = hashToken(rawToken);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
    },
  });

  if (!user) throw new Error('TOKEN_INVALID');
  if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
    throw new Error('TOKEN_EXPIRED');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  });
};
