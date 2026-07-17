import { apiClient } from './client';

export const reportsApi = {
  getWorkforceAnalytics: (params?: any) =>
    apiClient.get('/reports/workforce/', { params }),
  getPayrollAnalytics: (params?: any) =>
    apiClient.get('/reports/payroll/', { params }),
  getComplianceAnalytics: (params?: any) =>
    apiClient.get('/reports/compliance/', { params }),
  getBenefitsAnalytics: (params?: any) =>
    apiClient.get('/reports/benefits/', { params }),
  getPerformanceAnalytics: (params?: any) =>
    apiClient.get('/reports/performance/', { params }),
  getCustomReport: (data: any) =>
    apiClient.post('/reports/custom/', data),
};