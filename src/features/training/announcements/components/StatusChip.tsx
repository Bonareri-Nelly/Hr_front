// ==========================================
// COMPONENT: StatusChip
// ==========================================

import React from 'react';
import { TrainingStatus } from '../types';

interface StatusChipProps {
  status: TrainingStatus;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'md' }) => {
  const statusMap: Record<TrainingStatus, { label: string; className: string }> = {
    not_started: { label: 'Not Started', className: 'status-notstarted' },
    in_progress: { label: 'In Progress', className: 'status-inprogress' },
    completed: { label: 'Completed', className: 'status-completed' },
    overdue: { label: 'Overdue', className: 'status-overdue' }
  };

  const { label, className } = statusMap[status] || statusMap.not_started;
  const sizeClass = size === 'sm' ? 'status-chip-sm' : 'status-chip';

  return <span className={`${sizeClass} ${className}`}>{label}</span>;
};