import { apiClient } from './client';

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login/', credentials),
  register: (data: any) => apiClient.post('/auth/register/', data),
  logout: () => apiClient.post('/auth/logout/'),
  refreshToken: (refresh: string) =>
    apiClient.post('/auth/token/refresh/', { refresh }),
  getCurrentUser: () => apiClient.get('/auth/me/'),
  updateProfile: (data: any) => apiClient.put('/auth/profile/', data),
  changePassword: (data: any) => apiClient.post('/auth/change-password/', data),
};