import api from '../api/axios';
import type {
  ApiMessageResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
} from '../types';

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  logout: () => api.post<ApiMessageResponse>('/auth/logout').then((r) => r.data),

  me: () => api.get<MeResponse>('/auth/me').then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<ApiMessageResponse>('/auth/register', data).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post<ApiMessageResponse>('/auth/forgot-password', { email }).then((r) => r.data),
};
