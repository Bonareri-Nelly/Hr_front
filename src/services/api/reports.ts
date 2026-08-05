import { apiClient } from './client';

export const reportsApi = {
  getWorkforceAnalytics: (params?: any) =>
    apiClient.get('/reporting/dashboard/employees/', { params }),
  getPayrollAnalytics: (params?: any) =>
    apiClient.get('/reporting/dashboard/payroll/', { params }),
  getComplianceAnalytics: (params?: any) =>
    apiClient.get('/reporting/dashboard/compliance/', { params }),
  getBenefitsAnalytics: (params?: any) =>
    apiClient.get('/reporting/dashboard/benefits/', { params }),
  getPerformanceAnalytics: (params?: any) =>
    apiClient.get('/reporting/dashboard/performance/', { params }),
  getCustomReport: (data: any) =>
    apiClient.post('/reporting/preview/', data),
};
