// ==========================================
// HOOK: useRBAC
// ==========================================

import { useMemo } from 'react';
import { CURRENT_USER } from '../constants';
import { UserRole } from '../types';

type Permissions = {
  canViewAnnouncements: boolean;
  canViewTrainings: boolean;
  canViewCompliance: boolean;
  canCreateAnnouncements: boolean;
  canCreateTrainings: boolean;
  canEditAnnouncements: boolean;
  canEditTrainings: boolean;
  canDeleteAnnouncements: boolean;
  canDeleteTrainings: boolean;
  canAcknowledge: boolean;
  canUpdateTrainingStatus: boolean;
  canTrackCompliance: boolean;
  canExport: boolean;
  isAdmin: boolean;
  isBranchManager: boolean;
  isHRAdmin: boolean;
  isEmployee: boolean;
  isExecutive: boolean;
};

export const useRBAC = (): {
  user: typeof CURRENT_USER;
  permissions: Permissions;
  isAuthorized: (action: keyof Permissions) => boolean;
} => {
  const user = CURRENT_USER;

  const permissions = useMemo<Permissions>(() => {
    const role = user.role;

    return {
      // View permissions
      canViewAnnouncements: true,
      canViewTrainings: true,
      canViewCompliance: ['branch_manager', 'branch_hr_admin', 'executive', 'system_admin'].includes(role),
      
      // Create permissions
      canCreateAnnouncements: ['branch_manager', 'branch_hr_admin'].includes(role),
      canCreateTrainings: ['branch_manager', 'branch_hr_admin'].includes(role),
      
      // Edit/Delete permissions
      canEditAnnouncements: ['branch_manager', 'branch_hr_admin'].includes(role),
      canEditTrainings: ['branch_manager', 'branch_hr_admin'].includes(role),
      canDeleteAnnouncements: ['branch_manager', 'branch_hr_admin'].includes(role),
      canDeleteTrainings: ['branch_manager', 'branch_hr_admin'].includes(role),
      
      // Acknowledge permissions
      canAcknowledge: true,
      
      // Training status update
      canUpdateTrainingStatus: true,
      
      // Compliance tracking
      canTrackCompliance: ['branch_manager', 'branch_hr_admin', 'executive'].includes(role),
      
      // Export
      canExport: ['branch_manager', 'branch_hr_admin', 'executive'].includes(role),
      
      // Is admin
      isAdmin: ['branch_manager', 'branch_hr_admin', 'system_admin'].includes(role),
      
      // Role checks
      isBranchManager: role === 'branch_manager',
      isHRAdmin: role === 'branch_hr_admin',
      isEmployee: role === 'employee',
      isExecutive: role === 'executive'
    };
  }, [user.role]);

  return {
    user,
    permissions,
    isAuthorized: (action: keyof Permissions) => {
      return permissions[action] as boolean;
    }
  };
};