// ==========================================
// HOOK: useAnnouncements
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { MOCK_ANNOUNCEMENTS, CURRENT_USER } from '../constants';
import { Announcement, AnnouncementFormData } from '../types';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get announcements visible to current user
  const getVisibleAnnouncements = useCallback(() => {
    return announcements.filter(a => {
      const type = a.audience.type;
      if (type === 'company') return true;
      if (type === 'branch') return a.audience.targets.includes(CURRENT_USER.branch);
      if (type === 'department') return a.audience.targets.includes(CURRENT_USER.department);
      if (type === 'individual') return a.audience.targets.includes(CURRENT_USER.id);
      return false;
    });
  }, [announcements]);

  // Create new announcement
  const createAnnouncement = useCallback((data: AnnouncementFormData) => {
    setLoading(true);
    try {
      const newAnnouncement: Announcement = {
        id: `ann-${Date.now()}`,
        title: data.title,
        body: data.body,
        category: data.category,
        audience: {
          type: data.audience,
          targets: data.targets
        },
        priority: data.priority,
        requiresAck: data.requiresAck,
        postedBy: CURRENT_USER.name,
        postedAt: new Date().toISOString(),
        expiresAt: data.expiry || null,
        acknowledgedBy: []
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setError(null);
      return newAnnouncement;
    } catch (err) {
      setError('Failed to create announcement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Acknowledge announcement
  const acknowledgeAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => 
      prev.map(a => {
        if (a.id === id && !a.acknowledgedBy.includes(CURRENT_USER.id)) {
          return {
            ...a,
            acknowledgedBy: [...a.acknowledgedBy, CURRENT_USER.id]
          };
        }
        return a;
      })
    );
  }, []);

  // Check if user has acknowledged
  const hasAcknowledged = useCallback((announcement: Announcement) => {
    return announcement.acknowledgedBy.includes(CURRENT_USER.id);
  }, []);

  return {
    announcements,
    visibleAnnouncements: getVisibleAnnouncements(),
    loading,
    error,
    createAnnouncement,
    acknowledgeAnnouncement,
    hasAcknowledged
  };
};