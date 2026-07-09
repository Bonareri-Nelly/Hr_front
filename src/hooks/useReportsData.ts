import { useState, useEffect } from 'react';

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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data - replace with actual API call
        const mockData = {
          summary: {
            totalEmployees: 1248,
            totalPayroll: 'KES 84.6M',
            complianceScore: 98.2,
            benefitsUtilization: 67,
            turnoverRate: 8.5,
            avgPerformance: 4.2,
          },
          workforce: {
            headcount: [
              { month: 'Jan', total: 1180, newHires: 25, exits: 10 },
              { month: 'Feb', total: 1195, newHires: 18, exits: 8 },
              { month: 'Mar', total: 1210, newHires: 22, exits: 12 },
              { month: 'Apr', total: 1228, newHires: 30, exits: 15 },
              { month: 'May', total: 1240, newHires: 20, exits: 10 },
              { month: 'Jun', total: 1248, newHires: 15, exits: 5 },
            ],
            turnover: { rate: 8.5, trend: 'down' },
            tenure: { average: 4.2, distribution: [{ label: '0-2 yrs', value: 30 }, { label: '3-5 yrs', value: 40 }, { label: '5+ yrs', value: 30 }] },
            departments: [
              { name: 'Engineering', headcount: 156, spanOfControl: 12 },
              { name: 'Finance', headcount: 89, spanOfControl: 8 },
              { name: 'HR', headcount: 34, spanOfControl: 5 },
              { name: 'Sales', headcount: 112, spanOfControl: 10 },
              { name: 'Operations', headcount: 78, spanOfControl: 7 },
            ],
            diversity: [
              { category: 'Senior Leadership', count: 45, percentage: 3.6 },
              { category: 'Management', count: 180, percentage: 14.4 },
              { category: 'Professional', count: 540, percentage: 43.3 },
              { category: 'Support', count: 483, percentage: 38.7 },
            ],
          },
          payroll: {
            total: [
              { month: 'Jan', amount: 13600000 },
              { month: 'Feb', amount: 13850000 },
              { month: 'Mar', amount: 14100000 },
              { month: 'Apr', amount: 14350000 },
              { month: 'May', amount: 14600000 },
              { month: 'Jun', amount: 14850000 },
            ],
            breakdown: [
              { category: 'Base Salary', amount: 58000000, percentage: 68.5 },
              { category: 'Benefits', amount: 12800000, percentage: 15.1 },
              { category: 'Overtime', amount: 8500000, percentage: 10.0 },
              { category: 'Statutory', amount: 5400000, percentage: 6.4 },
            ],
            budget: { actual: 14850000, budget: 14500000, variance: 350000 },
            branchComparison: [
              { branch: 'Nairobi HQ', totalPayroll: 48400000, avgPerEmployee: 115000 },
              { branch: 'Mombasa', totalPayroll: 34800000, avgPerEmployee: 112000 },
              { branch: 'Kisumu', totalPayroll: 31200000, avgPerEmployee: 111000 },
              { branch: 'Remote Units', totalPayroll: 26800000, avgPerEmployee: 109000 },
              { branch: 'Eldoret', totalPayroll: 23400000, avgPerEmployee: 108000 },
            ],
          },
          compliance: {
            status: [
              { category: 'PAYE', filed: 120, pending: 0, total: 120 },
              { category: 'NSSF', filed: 115, pending: 5, total: 120 },
              { category: 'NHIF/SHIF', filed: 118, pending: 2, total: 120 },
              { category: 'Housing Levy', filed: 110, pending: 10, total: 120 },
            ],
            trend: [
              { month: 'Jan', amount: 850000 },
              { month: 'Feb', amount: 890000 },
              { month: 'Mar', amount: 920000 },
              { month: 'Apr', amount: 880000 },
              { month: 'May', amount: 940000 },
              { month: 'Jun', amount: 980000 },
            ],
            flags: [
              { branch: 'Eldoret', issue: 'NSSF filing overdue', status: 'overdue' },
              { branch: 'Mombasa', issue: 'Housing Levy pending', status: 'pending' },
            ],
            overallScore: 98.2,
          },
          benefits: {
            summary: [
              { category: 'Medical Insurance', utilization: 82, cost: 4800000, eligible: 1248 },
              { category: 'Pension', utilization: 76, cost: 3600000, eligible: 1248 },
              { category: 'Paid Leave', utilization: 65, cost: 2800000, eligible: 1248 },
              { category: 'Wellness', utilization: 52, cost: 1200000, eligible: 1248 },
              { category: 'Hardship Allowance', utilization: 38, cost: 800000, eligible: 800 },
            ],
            totalCost: 13200000,
            avgUtilization: 67,
          },
          performance: {
            distribution: [
              { rating: '5 - Exceptional', count: 156, percentage: 12.5 },
              { rating: '4 - Exceeds', count: 312, percentage: 25.0 },
              { rating: '3 - Meets', count: 498, percentage: 39.9 },
              { rating: '2 - Needs Improvement', count: 198, percentage: 15.9 },
              { rating: '1 - Underperforming', count: 84, percentage: 6.7 },
            ],
            departmentComparison: [
              { department: 'Engineering', avgScore: 4.2 },
              { department: 'Finance', avgScore: 4.0 },
              { department: 'HR', avgScore: 4.5 },
              { department: 'Sales', avgScore: 3.8 },
              { department: 'Operations', avgScore: 4.1 },
            ],
            trend: [
              { cycle: 'Q1 2025', avgScore: 3.8 },
              { cycle: 'Q2 2025', avgScore: 3.9 },
              { cycle: 'Q3 2025', avgScore: 4.0 },
              { cycle: 'Q4 2025', avgScore: 4.1 },
              { cycle: 'Q1 2026', avgScore: 4.2 },
            ],
            overallAvg: 4.2,
          },
        };

        setData(mockData);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, branch, department, dateRange]);

  return { data, loading, error };
};