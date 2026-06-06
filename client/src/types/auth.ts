import type { UserRole } from './common';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  token?: string; // Returned for Safari cross-origin Bearer token fallback
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
}

export interface MeResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  avatarUrl: string | null;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

