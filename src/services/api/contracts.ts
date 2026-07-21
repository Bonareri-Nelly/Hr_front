import { apiClient } from './client';

export const contractApi = {
  getAll: () => apiClient.get('/contracts/'),
  getById: (id: string) => apiClient.get(`/contracts/${id}/`),
  create: (data: any) => apiClient.post('/contracts/', data),
  update: (id: string, data: any) => apiClient.put(`/contracts/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/contracts/${id}/`),
  getExpiring: () => apiClient.get('/contracts/expiring/'),
  approve: (id: string) => apiClient.post(`/contracts/${id}/approve/`),
  renew: (id: string, data: { new_end_date?: string; reason?: string }) =>
    apiClient.post(`/contracts/${id}/renew/`, data),
  terminate: (id: string, data: { termination_date?: string; reason?: string }) =>
    apiClient.post(`/contracts/${id}/terminate/`, data),
  getByEmployee: (employeeId: string) =>
    apiClient.get(`/employees/${employeeId}/contracts/`),
};
