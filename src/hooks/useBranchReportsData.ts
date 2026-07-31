import { useState, useEffect } from 'react';

interface UseBranchReportsDataProps {
  dateRange: { start: string; end: string };
}

interface BranchReportEntry {
  id: string;
  title: string;
  category: 'headcount' | 'payroll' | 'compliance' | 'benefits' | 'performance';
  value: number;
  period: string;
  notes: string;
}

const STORAGE_KEY = 'hrfront-branch-reports-entries';

const getStoredEntries = (): BranchReportEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const buildData = (entries: BranchReportEntry[]) => {
  const headcountEntries = entries.filter((entry) => entry.category === 'headcount');
  const payrollEntries = entries.filter((entry) => entry.category === 'payroll');
  const complianceEntries = entries.filter((entry) => entry.category === 'compliance');
  const benefitsEntries = entries.filter((entry) => entry.category === 'benefits');
  const performanceEntries = entries.filter((entry) => entry.category === 'performance');

  const headcount = headcountEntries.length ? headcountEntries[0].value : 0;
  const payroll = payrollEntries.reduce((sum, entry) => sum + entry.value, 0);
  const complianceScore = complianceEntries.length
    ? Math.round(complianceEntries.reduce((sum, entry) => sum + entry.value, 0) / complianceEntries.length)
    : 0;
  const benefitsUtilization = benefitsEntries.length
    ? Math.round(benefitsEntries.reduce((sum, entry) => sum + entry.value, 0) / benefitsEntries.length)
    : 0;

  return {
    branchName: 'Your branch',
    snapshot: {
      headcount,
      newHires: headcountEntries.length ? Math.max(1, Math.round(headcountEntries[0].value * 0.03)) : 0,
      exits: headcountEntries.length ? Math.max(0, Math.round(headcountEntries[0].value * 0.01)) : 0,
      attritionRate: headcountEntries.length ? Number((headcountEntries[0].value / 1000).toFixed(1)) : 0,
      totalPayroll: `KES ${payroll.toLocaleString()}`,
      complianceStatus: { filed: complianceScore, pending: 0, total: Math.max(complianceScore, 1) },
    },
    workforce: {
      headcountTrend: headcountEntries.slice(0, 6).map((entry) => ({ month: entry.period, total: entry.value, newHires: Math.max(1, Math.round(entry.value * 0.04)), exits: Math.max(0, Math.round(entry.value * 0.01)) })),
      averageTenure: headcountEntries.length ? Number((headcountEntries[0].value / 1000).toFixed(1)) : 0,
      turnoverRate: headcountEntries.length ? Number((headcountEntries[0].value / 100).toFixed(1)) : 0,
    },
    payroll: {
      trend: payrollEntries.slice(0, 6).map((entry) => ({ month: entry.period, amount: entry.value })),
      breakdown: payrollEntries.length ? [{ category: 'Custom payroll', amount: payroll, percentage: 100 }] : [],
      budget: { actual: payroll, budget: payroll, variance: 0 },
    },
    compliance: {
      status: complianceEntries.length ? [{ category: 'Custom filing', filed: complianceScore, pending: 0, total: Math.max(complianceScore, 1) }] : [],
      flags: complianceEntries.length ? [{ issue: 'Review the latest entry', status: 'review' }] : [],
      overallScore: complianceScore,
    },
    benefits: {
      summary: benefitsEntries.length ? [{ category: 'Custom plan', utilization: benefitsUtilization, cost: payroll, eligible: headcount }] : [],
      totalCost: payroll,
      avgUtilization: benefitsUtilization,
    },
    performance: {
      overallAvg: performanceEntries.length ? Number((performanceEntries.reduce((sum, entry) => sum + entry.value, 0) / performanceEntries.length).toFixed(1)) : 0,
      trend: performanceEntries.slice(0, 6).map((entry) => ({ cycle: entry.period, avgScore: entry.value })),
    },
    customEntries: entries,
  };
};

export const useBranchReportsData = ({ dateRange }: UseBranchReportsDataProps) => {
  const [data, setData] = useState<any>(buildData([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setData(buildData(getStoredEntries()));
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