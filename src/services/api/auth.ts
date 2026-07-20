import { apiClient } from './client';

export const authApi = {
  // The Django LoginView authenticates with `username`, not `email`.
  login: (credentials: { username: string; password: string }) =>
    apiClient.post('/auth/login/', credentials),
  register: (data: any) => apiClient.post('/auth/register/', data),
  logout: (refresh?: string | null) =>
    apiClient.post('/auth/logout/', refresh ? { refresh } : {}),
  refreshToken: (refresh: string) =>
    apiClient.post('/auth/token/refresh/', { refresh }),
  getCurrentUser: () => apiClient.get('/auth/me/'),
  updateProfile: (data: any) => apiClient.put('/auth/profile/', data),
  changePassword: (data: any) => apiClient.post('/auth/change-password/', data),
};