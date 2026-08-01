import { navigationItems } from "./navigation";

export type RoleName = "System Admin" | "Executive" | "Manager" | "HR" | "Department Head" | "Finance" | "Employee";

const withProfile = (modules: string[]) => [...new Set([...modules, "user-profile"])] as string[];

export const roleModuleMap: Record<RoleName, string[]> = {
  "System Admin": [...navigationItems.map((item) => item.id)],
  Executive: withProfile(["executive-dashboard", "reports-analytics", "security-audit", "system-settings", "disciplinary-management", "announcements-training", "benefits-management", "my-documents", "ai-assistant"]),
  Manager: withProfile(["branch-dashboard", "reports-analytics", "candidate-applications", "employee-lifecycle", "contract-management", "performance-oversight", "onboarding", "offboarding", "disciplinary-management", "announcements-training", "benefits-management", "branch-reports", "my-documents", "my-payslips", "my-attendance", "ai-assistant"]),
  HR: withProfile(["hr-dashboard", "candidate-applications", "department-dashboard", "employee-lifecycle", "contract-management", "performance-oversight", "onboarding", "offboarding", "attendance-management", "leave-workflow", "leave-approvals", "disciplinary-cases", "disciplinary-management", "announcements-training", "payroll-creation", "finance-grievances", "my-attendance", "my-payslips", "ai-assistant"]),
  "Department Head": withProfile(["department-dashboard", "leave-workflow", "my-announcements", "my-attendance", "my-performance", "my-benefits", "my-payslips", "my-documents", "complaints", "leave-approvals", "reports-analytics", "ai-assistant"]),
  Finance: withProfile(["finance-dashboard", "payroll", "payroll-history", "tax-compliance", "compensation-data", "finance-grievances", "my-attendance", "my-benefits", "my-payslips", "my-documents", "my-announcements", "complaints", "ai-assistant"]),
  Employee: withProfile(["employee-dashboard", "leave-workflow", "my-announcements", "my-attendance", "my-performance", "my-benefits", "my-payslips", "my-documents", "complaints", "ai-assistant"]),
};

export const roleDefaultModule: Record<RoleName, string> = {
  "System Admin": "executive-dashboard",
  Executive: "executive-dashboard",
  Manager: "branch-dashboard",
  HR: "hr-dashboard",
  "Department Head": "department-dashboard",
  Finance: "finance-dashboard",
  Employee: "employee-dashboard",
};
