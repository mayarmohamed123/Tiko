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

  updateProfile: (data: { fullName?: string; email?: string; phone?: string; address?: string }) =>
    api.patch<{ message: string; user: MeResponse }>('/auth/profile', data).then((r) => r.data),

  changePassword: (data: any) =>
    api.post<ApiMessageResponse>('/auth/change-password', data).then((r) => r.data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api
      .patch<{ message: string; user: MeResponse }>('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
