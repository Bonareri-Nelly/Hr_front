import { apiClient } from './client';

export const performanceApi = {
  getCycles: () => apiClient.get('/performance/cycles/'),
  createCycle: (data: any) => apiClient.post('/performance/cycles/', data),
  updateCycle: (id: string, data: any) =>
    apiClient.put(`/performance/cycles/${id}/`, data),
  deleteCycle: (id: string) => apiClient.delete(`/performance/cycles/${id}/`),
  getGoals: (employeeId?: string) =>
    apiClient.get('/hr-operations/performance-goals/', { params: { employee: employeeId } }),
  createGoal: (data: any) => apiClient.post('/hr-operations/performance-goals/', data),
  updateGoal: (id: string, data: any) =>
    apiClient.put(`/hr-operations/performance-goals/${id}/`, data),
  deleteGoal: (id: string) => apiClient.delete(`/hr-operations/performance-goals/${id}/`),
  getReviews: (employeeId?: string) =>
    apiClient.get('/hr-operations/performance-reviews/', { params: { employee: employeeId } }),
  createReview: (data: any) => apiClient.post('/hr-operations/performance-reviews/', data),
  updateReview: (id: string, data: any) =>
    apiClient.put(`/hr-operations/performance-reviews/${id}/`, data),
  getRatingHistory: (employeeId: string) =>
    apiClient.get(`/performance/rating-history/${employeeId}/`),
};
