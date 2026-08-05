import { apiClient } from './client';

export const employeeApi = {
  getAll: () => apiClient.get('/employees/'),
  getById: (id: string) => apiClient.get(`/employees/${id}/`),
  create: (data: any) => apiClient.post('/employees/', data),
  update: (id: string, data: any) => apiClient.put(`/employees/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/employees/${id}/`),
  getDocuments: (id: string) => apiClient.get('/documents/', { params: { employee: id } }),
  getEducation: (id: string) => apiClient.get('/education/', { params: { employee: id } }),
  getWorkExperience: (id: string) => apiClient.get('/work-experience/', { params: { employee: id } }),
  getDependants: (id: string) => apiClient.get('/dependants/', { params: { employee: id } }),
  getCertifications: (id: string) => apiClient.get('/certifications/', { params: { employee: id } }),
  getSkills: (id: string) => apiClient.get('/skills/', { params: { employee: id } }),
  getBankAccounts: (id: string) => apiClient.get('/bank-accounts/', { params: { employee: id } }),
  getAssets: (id: string) => apiClient.get('/assets/', { params: { employee: id } }),
};
