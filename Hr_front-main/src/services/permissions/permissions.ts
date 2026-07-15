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

export function getModulePermissions(): ModulePermission[] {
  return defaultPermissions;
}

export function canViewModule(moduleId: string): boolean {
  return getModulePermissions().some((permission) => permission.module === moduleId && permission.can_view);
}
