import { useEffect, useState } from "react";
import { apiClient } from "../services/api";

interface UseBranchReportsDataProps {
  dateRange: { start: string; end: string };
}

type HrDashboardResponse = {
  employees?: number;
  payroll?: number;
  compliance?: number | null;
  branches?: Array<{ name?: string; employees?: number; amount?: number | null }>;
};

export const useBranchReportsData = ({ dateRange }: UseBranchReportsDataProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<HrDashboardResponse>("/hr-operations/dashboard/hr/", {
          params: { start_date: dateRange.start, end_date: dateRange.end },
        });
        const source = response.data;
        const headcount = source.employees ?? 0;
        const payroll = Number(source.payroll ?? 0);
        const branchName = source.branches?.[0]?.name || "All Branches";
        const month = new Date(dateRange.end || Date.now()).toLocaleString("en", { month: "short" });

        setData({
          branchName,
          snapshot: {
            headcount,
            newHires: 0,
            exits: 0,
            attritionRate: 0,
            totalPayroll: payroll,
            complianceStatus: { filed: 0, pending: 0, total: 0 },
          },
          workforce: { headcountTrend: [{ month, total: headcount, newHires: 0, exits: 0 }], averageTenure: 0, turnoverRate: 0 },
          payroll: { trend: [{ month, amount: payroll }], breakdown: [], budget: { actual: payroll, budget: payroll, variance: 0 } },
          compliance: { status: [], flags: [], overallScore: source.compliance ?? 0 },
          benefits: { summary: [], totalCost: 0, avgUtilization: 0 },
          performance: { overallAvg: 0, trend: [] },
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unable to load branch report data."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return { data, loading, error };
};
