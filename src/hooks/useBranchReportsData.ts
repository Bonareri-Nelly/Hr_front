import { useState, useEffect } from 'react';

interface UseBranchReportsDataProps {
  dateRange: { start: string; end: string };
}

export const useBranchReportsData = ({ dateRange }: UseBranchReportsDataProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Mock data - replace with actual API call
        const mockData = {
          branchName: 'Nairobi HQ',
          snapshot: {
            headcount: 420,
            newHires: 18,
            exits: 6,
            attritionRate: 8.5,
            totalPayroll: 'KES 28.4M',
            complianceStatus: { filed: 12, pending: 1, total: 13 },
          },
          workforce: {
            headcountTrend: [
              { month: 'Jan', total: 405, newHires: 10, exits: 5 },
              { month: 'Feb', total: 410, newHires: 8, exits: 3 },
              { month: 'Mar', total: 412, newHires: 6, exits: 4 },
              { month: 'Apr', total: 415, newHires: 12, exits: 9 },
              { month: 'May', total: 418, newHires: 8, exits: 5 },
              { month: 'Jun', total: 420, newHires: 6, exits: 2 },
            ],
            averageTenure: 4.2,
            turnoverRate: 8.5,
          },
          payroll: {
            trend: [
              { month: 'Jan', amount: 4200000 },
              { month: 'Feb', amount: 4350000 },
              { month: 'Mar', amount: 4500000 },
              { month: 'Apr', amount: 4600000 },
              { month: 'May', amount: 4750000 },
              { month: 'Jun', amount: 4840000 },
            ],
            breakdown: [
              { category: 'Base Salary', amount: 3200000, percentage: 66.1 },
              { category: 'Benefits', amount: 720000, percentage: 14.9 },
              { category: 'Overtime', amount: 480000, percentage: 9.9 },
              { category: 'Statutory', amount: 440000, percentage: 9.1 },
            ],
            budget: { actual: 4840000, budget: 4700000, variance: 140000 },
          },
          compliance: {
            status: [
              { category: 'PAYE', filed: 12, pending: 0, total: 12 },
              { category: 'NSSF', filed: 11, pending: 1, total: 12 },
              { category: 'NHIF/SHIF', filed: 12, pending: 0, total: 12 },
              { category: 'Housing Levy', filed: 10, pending: 2, total: 12 },
            ],
            flags: [
              { issue: 'NSSF filing pending for May', status: 'pending' },
            ],
            overallScore: 94.5,
          },
          benefits: {
            summary: [
              { category: 'Medical Insurance', utilization: 85, cost: 2400000, eligible: 420 },
              { category: 'Pension', utilization: 78, cost: 1800000, eligible: 420 },
              { category: 'Paid Leave', utilization: 62, cost: 1200000, eligible: 420 },
              { category: 'Wellness', utilization: 48, cost: 600000, eligible: 420 },
            ],
            totalCost: 6000000,
            avgUtilization: 68,
          },
          performance: {
            overallAvg: 4.2,
            trend: [
              { cycle: 'Q1 2025', avgScore: 3.9 },
              { cycle: 'Q2 2025', avgScore: 4.0 },
              { cycle: 'Q3 2025', avgScore: 4.1 },
              { cycle: 'Q4 2025', avgScore: 4.1 },
              { cycle: 'Q1 2026', avgScore: 4.2 },
            ],
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
  }, [dateRange]);

  return { data, loading, error };
};