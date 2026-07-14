// ==========================================
// COMPONENT: FeedFilter
// ==========================================

import React from 'react';

interface FeedFilterProps {
  typeFilter: string;
  priorityFilter: string;
  statusFilter: string;
  onTypeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  showCreateButtons?: boolean;
  onNewAnnouncement?: () => void;
  onNewTraining?: () => void;
}

export const FeedFilter: React.FC<FeedFilterProps> = ({
  typeFilter,
  priorityFilter,
  statusFilter,
  onTypeChange,
  onPriorityChange,
  onStatusChange,
  showCreateButtons = false,
  onNewAnnouncement,
  onNewTraining
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label><i className="fas fa-filter"></i> Type</label>
        <select value={typeFilter} onChange={(e) => onTypeChange(e.target.value)}>
          <option value="all">All</option>
          <option value="announcement">Announcements</option>
          <option value="training">Trainings</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Priority</label>
        <select value={priorityFilter} onChange={(e) => onPriorityChange(e.target.value)}>
          <option value="all">All</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Status</label>
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>
      {showCreateButtons && (
        <div className="filter-actions">
          <button className="btn-primary" onClick={onNewAnnouncement}>
            <i className="fas fa-plus-circle"></i> New Announcement
          </button>
          <button className="btn-primary" onClick={onNewTraining}>
            <i className="fas fa-plus-circle"></i> New Training
          </button>
        </div>
      )}
    </div>
  );
};