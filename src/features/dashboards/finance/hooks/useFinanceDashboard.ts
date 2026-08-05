import { useQuery } from "@tanstack/react-query";
import { resources } from "../../../../services/api/resources";

export interface FinanceDashboardData {
  branchSummary: {
    name: string;
    payrollCost: number;
    employees: number;
    readiness: number;
    status: "success" | "warning" | "danger" | "info";
  };
  approvals: {
    id: number;
    branch: string;
    period: string;
    amount: string;
    employees: number;
    status: string;
    tone: "success" | "warning" | "danger" | "info";
  }[];
  complianceItems: {
    label: string;
    value: string;
    percent: number;
    tone: "success" | "warning" | "danger" | "info";
  }[];
  disbursements: {
    title: string;
    detail: string;
    meta: string;
    tone: "success" | "warning" | "danger" | "info";
  }[];
  budgetRows: {
    category: string;
    allocated: string;
    spent: string;
    percent: number;
  }[];
  trend: {
    month: string;
    value: number;
  }[];
}

export function useFinanceDashboard() {
  const { data: payrollRuns, isLoading: runsLoading } = useQuery({
    queryKey: ["finance-dashboard-runs"],
    queryFn: () => resources.payrollRuns.list(),
  });

  const { data: complaints, isLoading: complaintsLoading } = useQuery({
    queryKey: ["finance-dashboard-complaints"],
    queryFn: () => resources.complaints.list(),
  });

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ["finance-dashboard-employees"],
    queryFn: () => resources.employees.list(),
  });

  const isLoading = runsLoading || complaintsLoading || employeesLoading;

  const data: FinanceDashboardData = {
    branchSummary: {
      name: "Branch payroll",
      payrollCost: payrollRuns?.reduce((acc, run: any) => acc + (run.total_amount || 0), 0) || 2450000,
      employees: employees?.length || 135,
      readiness: 91,
      status: "info",
    },
    approvals: payrollRuns?.map((run: any) => ({
      id: run.id,
      branch: run.name || "Operations",
      period: run.period || "July 2026",
      amount: `KES ${(run.total_amount / 1000).toFixed(0)}K`,
      employees: run.employee_count || 0,
      status: run.status || "Pending",
      tone: run.status === "Approved" ? "success" : run.status === "Rejected" ? "danger" : "warning",
    })) || [
      ["PR-2026-071", "Operations", "July 2026", "KES 450K", "45", "Bank validation", "warning"],
      ["PR-2026-072", "Administration", "July 2026", "KES 580K", "58", "Ready", "success"],
      ["PR-2026-073", "Sales", "July 2026", "KES 320K", "32", "Tax review", "info"],
    ],
    complianceItems: [
      { label: "PAYE filing", value: "Draft ready", percent: 67, tone: "warning" },
      { label: "NHIF reconciliation", value: "Complete", percent: 100, tone: "success" },
      { label: "NSSF remittance", value: "Pending review", percent: 82, tone: "info" },
      { label: "Bank file validation", value: "7 exceptions", percent: 74, tone: "danger" },
    ],
    disbursements: [
      ["Bank file generated", "Nairobi payroll batch", "Today 09:10", "success"],
      ["Approval pending", "Eldoret salary batch", "Due today", "warning"],
      ["Exception opened", "7 account-name mismatches", "Needs review", "danger"],
      ["Compliance packet", "July statutory report", "Draft ready", "info"],
    ],
    budgetRows: [
      ["Salaries", "KES 18.0M", "KES 9.0M", 50],
      ["Benefits", "KES 5.0M", "KES 2.3M", 46],
      ["Training", "KES 3.0M", "KES 1.2M", 40],
      ["Recruitment", "KES 4.0M", "KES 2.0M", 50],
    ],
    trend: [
      ["Feb", 88],
      ["Mar", 92],
      ["Apr", 96],
      ["May", 98],
      ["Jun", 100],
      ["Jul", 102],
    ],
  };

  return { data, isLoading };
}
