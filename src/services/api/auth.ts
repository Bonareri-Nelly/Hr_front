import { apiClient } from './client';

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  role?: string | { name?: string; display_name?: string } | null;
  role_name?: string;
  phone_number?: string;
  branch?: string | { name?: string } | null;
  branch_name?: string;
  is_approved?: boolean;
  is_active?: boolean;
  is_superuser?: boolean;
};

export type ProvisionUserInput = {
  username: string;
  email: string;
  password: string;
  role: number;
  phone_number?: string;
};

export type Role = { id: number; name: string; description?: string };

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
  me: () => apiClient.get<CurrentUser>('/auth/me/').then((response) => response.data),
  listUsers: () => apiClient.get<CurrentUser[]>('/auth/users/').then((response) => response.data),
  provisionUser: (data: ProvisionUserInput) => apiClient.post<CurrentUser>('/auth/users/', data).then((response) => response.data),
  listRoles: () => apiClient.get<Role[]>('/auth/roles/').then((response) => response.data),
  updateProfile: (data: any) => apiClient.put('/auth/profile/', data),
  changePassword: (data: any) => apiClient.post('/auth/change-password/', data),
};

export const login = authApi.login;
export const logout = authApi.logout;
export const getCurrentUser = authApi.getCurrentUser;
