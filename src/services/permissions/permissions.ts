import { navigationItems } from "../../constants/navigation";
import type { NavigationSection } from "../../types/navigation";
import type { ModulePermission } from "../../types/permissions";

export type RoleName =
  | "System Admin"
  | "Executive"
  | "HR Officer"
  | "Finance Officer"
  | "Branch Manager"
  | "Department Head"
  | "Employee";

const allModuleIds = navigationItems.map((item) => item.id);

const roleModuleIds: Record<RoleName, string[]> = {
  "System Admin": allModuleIds,
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
    "payroll-history",
    "tax-compliance",
    "compensation-data",
    "finance-dashboard",
    "employee-finance",
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
    "payroll-history",
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
  "Branch Manager": [
    "branch-dashboard",
    "branch-reports",
    "department-dashboard",
    "employee-lifecycle",
    "performance-oversight",
    "attendance-management",
    "leave-workflow",
    "leave-approvals",
    "announcements-training",
    "benefits-management",
    "disciplinary-cases",
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

const roleDefaultModule: Record<RoleName, string> = {
  "System Admin": "executive-dashboard",
  Executive: "executive-dashboard",
  "HR Officer": "hr-dashboard",
  "Finance Officer": "finance-dashboard",
  "Branch Manager": "branch-dashboard",
  "Department Head": "department-dashboard",
  Employee: "employee-dashboard",
};

const approvalModules = new Set(["payroll-approval", "leave-approvals", "disciplinary-management"]);
const createModules = new Set(["payroll-creation", "employee-lifecycle", "contract-management", "onboarding", "leave-workflow", "announcements-training", "benefits-management"]);
const updateModules = new Set([...createModules, "attendance-management", "performance-oversight", "employee-finance"]);
const deleteModules = new Set(["employee-lifecycle", "contract-management", "benefits-management"]);

function normalizeRole(value: unknown): RoleName | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase().replace(/[_-]+/g, " ");

  if (!normalized) return null;
  if (normalized.includes("super") || normalized.includes("system admin") || normalized === "admin") return "System Admin";
  if (normalized.includes("executive") || normalized.includes("director") || normalized.includes("ceo")) return "Executive";
  if (normalized.includes("finance") || normalized.includes("account")) return "Finance Officer";
  if (normalized.includes("branch") && normalized.includes("manager")) return "Branch Manager";
  if (normalized.includes("department") || normalized.includes("head")) return "Department Head";
  if (normalized.includes("hr") || normalized.includes("human resource")) return "HR Officer";
  if (normalized.includes("employee") || normalized.includes("staff") || normalized.includes("user")) return "Employee";

  return null;
}

function extractRoleName(value: unknown): string | null {
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    for (const item of value) {
      const roleName = extractRoleName(item);
      if (roleName) return roleName;
    }
    return null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const roleName = record.name ?? record.role_name ?? record.role ?? record.title;

    return typeof roleName === "string" ? roleName : null;
  }

  return null;
}

function readCurrentUser(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("current_user");
    return storedUser ? JSON.parse(storedUser) as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export function getCurrentUserRole(): RoleName | null {
  const user = readCurrentUser();
  if (!user) return null;

  const roleValue =
    user.role ??
    user.user_role ??
    user.role_name ??
    user.group ??
    user.groups ??
    user.permission_role ??
    user.username;

  const extractedRole = extractRoleName(roleValue);
  if (extractedRole) {
    return normalizeRole(extractedRole);
  }

  return null;
}

export function getAllowedModuleIds(role = getCurrentUserRole()): Set<string> {
  return new Set(role ? roleModuleIds[role] : []);
}

export function getDefaultRouteForRole(role = getCurrentUserRole()): string {
  if (!role) return "/dashboard/employee";

  const moduleId = roleDefaultModule[role];
  return navigationItems.find((item) => item.id === moduleId)?.path ?? "/dashboard/employee";
}

export function getModulePermissions(role = getCurrentUserRole()): ModulePermission[] {
  const allowedModuleIds = getAllowedModuleIds(role);

  return navigationItems.map((item) => {
    const canView = allowedModuleIds.has(item.id);

    return {
      module: item.id,
      can_view: canView,
      can_create: canView && createModules.has(item.id),
      can_update: canView && updateModules.has(item.id),
      can_delete: canView && deleteModules.has(item.id) && role === "System Admin",
      can_approve: canView && approvalModules.has(item.id),
    };
  });
}

export function canViewModule(moduleId: string): boolean {
  return getAllowedModuleIds().has(moduleId);
}

export function getAllowedNavigationSections(): NavigationSection[] {
  const allowedModuleIds = getAllowedModuleIds();
  const grouped = new Map<string, NavigationSection["items"]>();

  navigationItems.forEach((item) => {
    if (!allowedModuleIds.has(item.id)) return;
    const items = grouped.get(item.section) ?? [];
    items.push(item);
    grouped.set(item.section, items);
  });

  return Array.from(grouped.entries()).map(([label, items]) => ({ label, items }));
}

export function hasActiveSession(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("access_token") ?? localStorage.getItem("hr_payroll_access_token"));
}
