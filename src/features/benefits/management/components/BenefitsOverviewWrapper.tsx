// src/features/benefits/management/components/BenefitsOverviewWrapper.tsx
import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Dashboard } from '../pages/Dashboard';

interface BenefitsOverviewWrapperProps {
  role: 'Finance' | 'Branch Manager' | 'Executive' | 'HR Admin';
  userId?: string;
  branchId?: string;
  className?: string;
}

export const BenefitsOverviewWrapper: React.FC<BenefitsOverviewWrapperProps> = ({
  role,
  userId,
  branchId,
  className = '',
}) => {
  // Access control validation
  if (role === 'Branch Manager' && !branchId) {
    return (
      <div className={`flex h-64 items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center ${className}`}>
        <div>
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-semibold text-red-700">
            Access Restricted
          </h3>
          <p className="mt-1 text-sm text-red-600">
            Branch ID is required for Branch Manager role.
            Please contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has permission to view this module
  const allowedRoles = ['Finance', 'Branch Manager', 'Executive'];
  if (!allowedRoles.includes(role)) {
    return (
      <div className={`flex h-64 items-center justify-center rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center ${className}`}>
        <div>
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-2 text-lg font-semibold text-yellow-700">
            Insufficient Permissions
          </h3>
          <p className="mt-1 text-sm text-yellow-600">
            You don't have permission to access the Benefits Overview module.
            This module is available for Finance, Branch Manager, and Executive roles.
          </p>
        </div>
      </div>
    );
  }

  return <Dashboard role={role} branchId={branchId} userId={userId} />;
};