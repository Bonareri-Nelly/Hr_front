import { apiClient } from './client';

export const dashboardApi = {
  getHRDashboard: (branch?: string) =>
    apiClient.get('/hr-operations/dashboard/hr/', { params: { branch } }),
  getBranchDashboard: (branchId: string) =>
    apiClient.get(`/hr-operations/dashboard/branch/${branchId}/`),
  getExecutiveDashboard: (params?: any) =>
    apiClient.get('/hr-operations/dashboard/executive/', { params }),
};