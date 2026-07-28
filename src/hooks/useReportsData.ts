import { useEffect, useState } from 'react';
import { apiClient } from '../services/api/client';

interface UseReportsDataProps {
  timeRange: 'monthly' | 'quarterly' | 'annual';
  branch: string;
  department: string;
  dateRange: { start: string; end: string };
}

export const useReportsData = ({ timeRange, branch, department, dateRange }: UseReportsDataProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { time_range: timeRange, branch, department, start_date: dateRange.start, end_date: dateRange.end };
        const [workforce, payroll, compliance, benefits, performance] = await Promise.all([
          apiClient.get('/reports/workforce/', { params }), apiClient.get('/reports/payroll/', { params }),
          apiClient.get('/reports/compliance/', { params }), apiClient.get('/reports/benefits/', { params }),
          apiClient.get('/reports/performance/', { params }),
        ]);
        const workforceData = workforce.data;
        const payrollData = payroll.data;
        const benefitsData = benefits.data;
        const performanceData = performance.data;
        setData({
          summary: {
            totalEmployees: workforceData.totalEmployees || 0,
            totalPayroll: `KES ${Number(payrollData.totalPayroll || 0).toLocaleString()}`,
            complianceScore: compliance.data.overallScore || 0,
            benefitsUtilization: benefitsData.avgUtilization || 0,
            turnoverRate: workforceData.turnoverRate || 0,
            avgPerformance: performanceData.overallAvg || 0,
          },
          workforce: workforceData, payroll: payrollData, compliance: compliance.data,
          benefits: benefitsData, performance: performanceData,
        });
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange, branch, department, dateRange.start, dateRange.end]);

  return { data, loading, error };
};
