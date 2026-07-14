// ==========================================
// COMPONENT: AnnouncementCard
// ==========================================

import React from 'react';
import { Announcement } from '../types';
import { AudienceBadge } from './AudienceBadge';
import { useRBAC } from '../hooks/useRBAC';

interface AnnouncementCardProps {
  announcement: Announcement;
  isRead: boolean;
  onView: (id: string) => void;
  onAcknowledge: (id: string) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  isRead,
  onView,
  onAcknowledge
}) => {
  const { permissions } = useRBAC();

  return (
    <div className={`feed-item ${isRead ? 'read' : 'unread'}`}>
      <div className="header">
        <div className="title">
          {!isRead && <span className="unread-dot"></span>}
          {announcement.title}
        </div>
        <div className="badge-group">
          <span className={`badge ${announcement.priority === 'urgent' ? 'badge-urgent' : 'badge-normal'}`}>
            {announcement.priority}
          </span>
          <AudienceBadge type={announcement.audience.type} />
        </div>
      </div>
      <div className="meta">
        <span><i className="fas fa-tag"></i> {announcement.category}</span>
        <span><i className="fas fa-user"></i> {announcement.postedBy}</span>
        <span><i className="fas fa-calendar"></i> {new Date(announcement.postedAt).toLocaleDateString()}</span>
        {announcement.expiresAt && (
          <span><i className="fas fa-clock"></i> Expires {new Date(announcement.expiresAt).toLocaleDateString()}</span>
        )}
      </div>
      <div className="actions">
        <button className="btn-outline btn-sm" onClick={() => onView(announcement.id)}>
          <i className="fas fa-eye"></i> View Details
        </button>
        {announcement.requiresAck && !isRead && permissions.canAcknowledge && (
          <button className="btn-success btn-sm" onClick={() => onAcknowledge(announcement.id)}>
            <i className="fas fa-check"></i> Acknowledge
          </button>
        )}
      </div>
    </div>
  );
};