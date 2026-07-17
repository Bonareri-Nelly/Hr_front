import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/api';

export const useReports = () => {
  const getWorkforce = (params?: any) =>
    useQuery({
      queryKey: ['reports', 'workforce', params],
      queryFn: () => reportsApi.getWorkforceAnalytics(params).then((res) => res.data),
    });

  const getPayroll = (params?: any) =>
    useQuery({
      queryKey: ['reports', 'payroll', params],
      queryFn: () => reportsApi.getPayrollAnalytics(params).then((res) => res.data),
    });

  const getCompliance = (params?: any) =>
    useQuery({
      queryKey: ['reports', 'compliance', params],
      queryFn: () => reportsApi.getComplianceAnalytics(params).then((res) => res.data),
    });

  const getBenefits = (params?: any) =>
    useQuery({
      queryKey: ['reports', 'benefits', params],
      queryFn: () => reportsApi.getBenefitsAnalytics(params).then((res) => res.data),
    });

  const getPerformance = (params?: any) =>
    useQuery({
      queryKey: ['reports', 'performance', params],
      queryFn: () => reportsApi.getPerformanceAnalytics(params).then((res) => res.data),
    });

  return {
    getWorkforce,
    getPayroll,
    getCompliance,
    getBenefits,
    getPerformance,
  };
};