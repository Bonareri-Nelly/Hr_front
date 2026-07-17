import { navigationItems } from "../../constants/navigation";
import { roleDefaultModule, roleModuleMap, type RoleName } from "../../constants/roleModuleMap";
import type { NavigationSection } from "../../types/navigation";
import type { ModulePermission } from "../../types/permissions";

export type { RoleName } from "../../constants/roleModuleMap";

function readCurrentUser(): Record<string, unknown> | null {
  try { return JSON.parse(localStorage.getItem("current_user") ?? localStorage.getItem("user") ?? "null") as Record<string, unknown> | null; } catch { return null; }
}

function normalizeRole(value: unknown): RoleName | null {
  const name = typeof value === "object" && value ? String((value as Record<string, unknown>).name ?? "") : String(value ?? "");
  const normalized = name.trim().toLowerCase().replace(/[_-]+/g, " ");
  if (normalized.includes("system") || normalized.includes("super") || normalized === "admin") return "System Admin";
  if (normalized.includes("executive") || normalized.includes("director") || normalized.includes("ceo")) return "Executive";
  if (normalized.includes("department") || normalized.includes("head")) return "Department Head";
  if (normalized.includes("manager")) return "Manager";
  if (normalized.includes("finance") || normalized.includes("payroll")) return "Finance";
  if (normalized === "hr" || normalized.includes("human resource")) return "HR";
  if (normalized.includes("employee") || normalized.includes("staff")) return "Employee";
  return null;
}

export function getCurrentUserRole(): RoleName | null {
  const user = readCurrentUser();
  return normalizeRole(user?.role ?? user?.role_name ?? user?.user_role);
}

export function getAllowedModuleIds(role = getCurrentUserRole()): Set<string> { return new Set(role ? roleModuleMap[role] : []); }
export function getDefaultRouteForRole(role = getCurrentUserRole()): string { const id = role ? roleDefaultModule[role] : "employee-dashboard"; return navigationItems.find((item) => item.id === id)?.path ?? "/"; }
export function canViewModule(moduleId: string): boolean { return getAllowedModuleIds().has(moduleId); }
export function getAllowedNavigationSections(): NavigationSection[] {
  const allowed = getAllowedModuleIds(); const sections = new Map<string, NavigationSection["items"]>();
  navigationItems.filter((item) => allowed.has(item.id)).forEach((item) => sections.set(item.section, [...(sections.get(item.section) ?? []), item]));
  return [...sections].map(([label, items]) => ({ label, items }));
}
export function getModulePermissions(role = getCurrentUserRole()): ModulePermission[] { const allowed = getAllowedModuleIds(role); return navigationItems.map((item) => ({ module: item.id, can_view: allowed.has(item.id), can_create: allowed.has(item.id), can_update: allowed.has(item.id), can_delete: role === "System Admin" && allowed.has(item.id), can_approve: allowed.has(item.id) && ["payroll-approval", "leave-approvals"].includes(item.id) })); }
export function hasActiveSession(): boolean { return Boolean(localStorage.getItem("hr_payroll_access_token") ?? localStorage.getItem("access_token")); }
