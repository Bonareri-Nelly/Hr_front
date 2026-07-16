import { navigationItems } from "../../constants/navigation";
import type { ModulePermission } from "../../types/permissions";

const defaultPermissions: ModulePermission[] = navigationItems.map((item) => ({
  module: item.id,
  can_view: true,
  can_create: false,
  can_update: false,
  can_delete: false,
  can_approve: false,
}));

const roleModuleIds: Record<string, string[]> = {
  "System Admin": navigationItems.map((item) => item.id),
  Executive: [
    "executive-dashboard",
    "reports-analytics",
    "ai-assistant",
    "security-audit",
    "user-profile",
    "hr-dashboard",
    "department-dashboard",
    "branch-dashboard",
    "branch-reports",
    "payroll",
    "payroll-creation",
    "payroll-approval",
    "payroll-history",
    "tax-compliance",
    "bank-integration",
    "compensation-data",
    "multi-currency-gl-integration",
    "finance-dashboard",
    "bank-integration-accounts",
    "tax-compliance-accounts",
    "benefits-management-accounts",
    "employee-finance",
    "finance-grievances",
  ],
  "Finance Officer": [
    "finance-dashboard",
    "bank-integration-accounts",
    "tax-compliance-accounts",
    "benefits-management-accounts",
    "employee-finance",
    "finance-grievances",
    "payroll",
    "payroll-creation",
    "payroll-approval",
    "payroll-history",
    "tax-compliance",
    "bank-integration",
    "compensation-data",
    "multi-currency-gl-integration",
  ],
  "HR Officer": [
    "hr-dashboard",
    "department-dashboard",
    "employee-lifecycle",
    "contract-management",
    "performance-oversight",
    "offboarding",
    "onboarding",
    "attendance-management",
    "leave-workflow",
    "leave-approvals",
    "disciplinary-cases",
    "disciplinary-management",
    "announcements-training",
    "benefits-management",
    "branch-dashboard",
    "branch-reports",
    "payroll",
    "payroll-creation",
  ],
  "Branch Manager": [
    "branch-dashboard",
    "branch-reports",
    "hr-dashboard",
    "department-dashboard",
    "employee-lifecycle",
    "performance-oversight",
    "attendance-management",
    "leave-workflow",
    "leave-approvals",
    "announcements-training",
    "benefits-management",
  ],
  "Department Head": [
    "department-dashboard",
    "employee-lifecycle",
    "performance-oversight",
    "attendance-management",
    "leave-workflow",
    "leave-approvals",
    "announcements-training",
  ],
  Employee: [
    "employee-dashboard",
    "my-attendance",
    "my-performance",
    "my-benefits",
    "my-payslips",
    "my-documents",
    "my-announcements",
    "complaints",
  ],
};

function normalizeRole(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();

  if (normalized.includes("system") || normalized.includes("admin") || normalized.includes("super")) {
    return "System Admin";
  }

  if (normalized.includes("executive") || normalized.includes("director")) {
    return "Executive";
  }

  if (normalized.includes("finance") || normalized.includes("account")) {
    return "Finance Officer";
  }

  if (normalized.includes("branch manager") || normalized.includes("manager")) {
    return "Branch Manager";
  }

  if (normalized.includes("department") || normalized.includes("head")) {
    return "Department Head";
  }

  if (normalized.includes("hr") || normalized.includes("officer")) {
    return "HR Officer";
  }

  if (normalized.includes("employee") || normalized.includes("staff") || normalized.includes("user")) {
    return "Employee";
  }

  return null;
}

export function getCurrentUserRole(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("current_user");
    if (!storedUser) return null;

    const parsed = JSON.parse(storedUser) as Record<string, unknown>;
    const roleValue = parsed.role ?? parsed.user_role ?? parsed.role_name ?? parsed.group;
    return normalizeRole(roleValue);
  } catch {
    return null;
  }
}

export function getModulePermissions(): ModulePermission[] {
  const role = getCurrentUserRole();
  const allowedModuleIds = role ? new Set(roleModuleIds[role] ?? roleModuleIds.Employee) : new Set(navigationItems.map((item) => item.id));

  return navigationItems.map((item) => ({
    ...defaultPermissions.find((permission) => permission.module === item.id),
    module: item.id,
    can_view: allowedModuleIds.has(item.id),
    can_create: false,
    can_update: false,
    can_delete: false,
    can_approve: false,
  }));
}

export function canViewModule(moduleId: string): boolean {
  return getModulePermissions().some((permission) => permission.module === moduleId && permission.can_view);
}
