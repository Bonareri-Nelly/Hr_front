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

  const payrollRunsArray = (payrollRuns as any[]) || [];
  const employeesArray = (employees as any[]) || [];

  const data: FinanceDashboardData = {
    branchSummary: {
      name: "Branch payroll",
      payrollCost: payrollRunsArray.reduce((acc, run: any) => acc + (run.total_amount || 0), 0) || 2450000,
      employees: employeesArray.length || 135,
      readiness: 91,
      status: "info",
    },
    approvals: payrollRunsArray.map((run: any) => ({
      id: run.id,
      branch: run.name || "Operations",
      period: run.period || "July 2026",
      amount: `KES ${((run.total_amount || 0) / 1000).toFixed(0)}K`,
      employees: run.employee_count || 0,
      status: run.status || "Pending",
      tone: run.status === "Approved" ? "success" : run.status === "Rejected" ? "danger" : "warning",
    })),
    complianceItems: [
      { label: "PAYE filing", value: "Draft ready", percent: 67, tone: "warning" },
      { label: "NHIF reconciliation", value: "Complete", percent: 100, tone: "success" },
      { label: "NSSF remittance", value: "Pending review", percent: 82, tone: "info" },
      { label: "Bank file validation", value: "7 exceptions", percent: 74, tone: "danger" },
    ],
    disbursements: [
      { title: "Bank file generated", detail: "Nairobi payroll batch", meta: "Today 09:10", tone: "success" },
      { title: "Approval pending", detail: "Eldoret salary batch", meta: "Due today", tone: "warning" },
      { title: "Exception opened", detail: "7 account-name mismatches", meta: "Needs review", tone: "danger" },
      { title: "Compliance packet", detail: "July statutory report", meta: "Draft ready", tone: "info" },
    ],
    budgetRows: [
      { category: "Salaries", allocated: "KES 18.0M", spent: "KES 9.0M", percent: 50 },
      { category: "Benefits", allocated: "KES 5.0M", spent: "KES 2.3M", percent: 46 },
      { category: "Training", allocated: "KES 3.0M", spent: "KES 1.2M", percent: 40 },
      { category: "Recruitment", allocated: "KES 4.0M", spent: "KES 2.0M", percent: 50 },
    ],
    trend: [
      { month: "Feb", value: 88 },
      { month: "Mar", value: 92 },
      { month: "Apr", value: 96 },
      { month: "May", value: 98 },
      { month: "Jun", value: 100 },
      { month: "Jul", value: 102 },
    ],
  };

  return { data, isLoading };
}
