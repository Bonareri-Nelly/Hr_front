// ==========================================
// COMPONENT: TrainingCard
// ==========================================

import React from 'react';
import { Training } from '../types';
import { AudienceBadge } from './AudienceBadge';
import { StatusChip } from './StatusChip';

interface TrainingCardProps {
  training: Training;
  status: string;
  onView: (id: string) => void;
  onUpdateStatus: (id: string) => void;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({
  training,
  status,
  onView,
  onUpdateStatus
}) => {
  return (
    <div className="feed-item">
      <div className="header">
        <div className="title">
          {training.mandatory && <i className="fas fa-exclamation-triangle" style={{ color: '#c9a84c', fontSize: 14 }}></i>}
          {training.title}
        </div>
        <div className="badge-group">
          {training.mandatory && <span className="badge badge-mandatory">Mandatory</span>}
          <AudienceBadge type={training.audience.type} />
          <StatusChip status={status as any} />
        </div>
      </div>
      <div className="meta">
        <span><i className="fas fa-tag"></i> {training.category}</span>
        <span><i className="fas fa-chalkboard"></i> {training.delivery}</span>
        {training.deadline && (
          <span><i className="fas fa-clock"></i> Due {new Date(training.deadline).toLocaleDateString()}</span>
        )}
      </div>
      <div className="actions">
        <button className="btn-outline btn-sm" onClick={() => onView(training.id)}>
          <i className="fas fa-eye"></i> View Details
        </button>
        {status !== 'completed' && (
          <button className="btn-primary btn-sm" onClick={() => onUpdateStatus(training.id)}>
            <i className="fas fa-edit"></i> Update Status
          </button>
        )}
      </div>
    </div>
  );
};