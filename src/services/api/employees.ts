import { apiClient } from './client';

export const employeeApi = {
  getAll: () => apiClient.get('/employees/'),
  getById: (id: string) => apiClient.get(`/employees/${id}/`),
  create: (data: any) => apiClient.post('/employees/', data),
  update: (id: string, data: any) => apiClient.put(`/employees/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/employees/${id}/`),
  getDocuments: (id: string) => apiClient.get(`/employees/${id}/documents/`),
  getEducation: (id: string) => apiClient.get(`/employees/${id}/education/`),
  getWorkExperience: (id: string) =>
    apiClient.get(`/employees/${id}/work-experience/`),
  getDependants: (id: string) => apiClient.get(`/employees/${id}/dependants/`),
  getCertifications: (id: string) =>
    apiClient.get(`/employees/${id}/certifications/`),
  getSkills: (id: string) => apiClient.get(`/employees/${id}/skills/`),
  getBankAccounts: (id: string) => apiClient.get(`/employees/${id}/bank-accounts/`),
  getAssets: (id: string) => apiClient.get(`/employees/${id}/assets/`),
};