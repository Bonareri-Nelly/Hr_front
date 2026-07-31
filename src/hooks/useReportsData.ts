import { useState, useEffect } from 'react';

interface UseReportsDataProps {
  timeRange: 'monthly' | 'quarterly' | 'annual';
  branch: string;
  department: string;
  dateRange: { start: string; end: string };
}

interface ReportEntry {
  id: string;
  title: string;
  category: 'headcount' | 'payroll' | 'compliance' | 'benefits' | 'performance';
  value: number;
  period: string;
  notes: string;
}

const STORAGE_KEY = 'hrfront-reports-entries';

const getStoredEntries = (): ReportEntry[] => {
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

const writeStoredEntries = (entries: ReportEntry[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const buildData = (entries: ReportEntry[]) => {
  const headcountEntries = entries.filter((entry) => entry.category === 'headcount');
  const payrollEntries = entries.filter((entry) => entry.category === 'payroll');
  const complianceEntries = entries.filter((entry) => entry.category === 'compliance');
  const benefitsEntries = entries.filter((entry) => entry.category === 'benefits');
  const performanceEntries = entries.filter((entry) => entry.category === 'performance');

  const totalEmployees = headcountEntries.reduce((sum, entry) => sum + entry.value, 0);
  const totalPayroll = payrollEntries.reduce((sum, entry) => sum + entry.value, 0);
  const averageCompliance = complianceEntries.length
    ? Math.round(complianceEntries.reduce((sum, entry) => sum + entry.value, 0) / complianceEntries.length)
    : 0;
  const averageBenefits = benefitsEntries.length
    ? Math.round(benefitsEntries.reduce((sum, entry) => sum + entry.value, 0) / benefitsEntries.length)
    : 0;
  const averagePerformance = performanceEntries.length
    ? Number((performanceEntries.reduce((sum, entry) => sum + entry.value, 0) / performanceEntries.length).toFixed(1))
    : 0;

  return {
    summary: {
      totalEmployees,
      totalPayroll: `KES ${totalPayroll.toLocaleString()}`,
      complianceScore: averageCompliance,
      benefitsUtilization: averageBenefits,
      turnoverRate: headcountEntries.length ? Number((headcountEntries[0].value / 100).toFixed(1)) : 0,
      avgPerformance: averagePerformance,
    },
    workforce: {
      headcount: headcountEntries.slice(0, 6).map((entry) => ({
        month: entry.period,
        total: entry.value,
        newHires: Math.max(1, Math.round(entry.value * 0.04)),
        exits: Math.max(0, Math.round(entry.value * 0.01)),
      })),
      turnover: { rate: headcountEntries.length ? Number((headcountEntries[0].value / 100).toFixed(1)) : 0, trend: 'stable' },
      tenure: {
        average: headcountEntries.length ? Number((headcountEntries[0].value / 1000).toFixed(1)) : 0,
        distribution: headcountEntries.length ? [{ label: 'Newer hires', value: 50 }, { label: 'Stable staff', value: 30 }, { label: 'Long tenure', value: 20 }] : [],
      },
      departments: headcountEntries.length ? [{ name: 'Custom Team', headcount: headcountEntries[0].value, spanOfControl: 6 }] : [],
      diversity: [],
    },
    payroll: {
      total: payrollEntries.slice(0, 6).map((entry) => ({ month: entry.period, amount: entry.value })),
      breakdown: payrollEntries.length
        ? [{ category: 'Custom payroll', amount: totalPayroll, percentage: 100 }]
        : [],
      budget: { actual: totalPayroll, budget: totalPayroll, variance: 0 },
      branchComparison: payrollEntries.length ? [{ branch: 'Your branch', totalPayroll: totalPayroll, avgPerEmployee: Math.round(totalPayroll / Math.max(1, headcountEntries[0]?.value || 1)) }] : [],
    },
    compliance: {
      status: complianceEntries.length ? [{ category: 'Custom filing', filed: averageCompliance, pending: 0, total: averageCompliance }] : [],
      trend: complianceEntries.slice(0, 6).map((entry) => ({ month: entry.period, amount: entry.value })),
      flags: complianceEntries.length ? [{ branch: 'Your branch', issue: entryNotes(complianceEntries[0]), status: 'review' }] : [],
      overallScore: averageCompliance,
    },
    benefits: {
      summary: benefitsEntries.length ? [{ category: 'Custom plan', utilization: averageBenefits, cost: totalPayroll, eligible: totalEmployees }] : [],
      totalCost: totalPayroll,
      avgUtilization: averageBenefits,
    },
    performance: {
      distribution: performanceEntries.length ? [{ rating: 'Current', count: performanceEntries.length, percentage: 100 }] : [],
      departmentComparison: [],
      trend: performanceEntries.slice(0, 6).map((entry) => ({ cycle: entry.period, avgScore: entry.value })),
      overallAvg: averagePerformance,
    },
    customEntries: entries,
  };
};

const entryNotes = (entry?: ReportEntry) => entry?.notes || 'New report entry';

export const useReportsData = ({ timeRange, branch, department, dateRange }: UseReportsDataProps) => {
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
  }, [timeRange, branch, department, dateRange]);

  const addEntry = (entry: ReportEntry) => {
    const nextEntries = [entry, ...getStoredEntries()].slice(0, 12);
    writeStoredEntries(nextEntries);
    setData(buildData(nextEntries));
  };

  return { data, loading, error, addEntry };
};