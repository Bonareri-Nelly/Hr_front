// ==========================================
// COMPONENT: AudienceBadge
// ==========================================

import React from 'react';
import { AudienceType } from '../types';

interface AudienceBadgeProps {
  type: AudienceType;
}

export const AudienceBadge: React.FC<AudienceBadgeProps> = ({ type }) => {
  const badgeMap: Record<AudienceType, { label: string; className: string }> = {
    company: { label: 'Company-wide', className: 'badge-company' },
    branch: { label: 'Branch', className: 'badge-branch' },
    department: { label: 'Department', className: 'badge-dept' },
    individual: { label: 'Individual', className: 'badge-individual' }
  };

  const { label, className } = badgeMap[type];

  return <span className={`badge ${className}`}>{label}</span>;
};