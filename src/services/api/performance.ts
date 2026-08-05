import { apiClient } from './client';

export const performanceApi = {
  // Appraisal cycles come from hr-operations: that model carries the name,
  // review period, scope, rating scale and employee status this app renders.
  // /performance/cycles/ is a different model keyed on `title`.
  getCycles: () => apiClient.get('/hr-operations/performance-cycles/'),
  createCycle: (data: any) => apiClient.post('/hr-operations/performance-cycles/', data),
  updateCycle: (id: string, data: any) =>
    apiClient.patch(`/hr-operations/performance-cycles/${id}/`, data),
  deleteCycle: (id: string) => apiClient.delete(`/hr-operations/performance-cycles/${id}/`),
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
    apiClient.get('/performance/reviews/', { params: { employee: employeeId } }),
};
