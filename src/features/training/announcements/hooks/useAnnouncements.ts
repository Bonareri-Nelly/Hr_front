// ==========================================
// HOOK: useAnnouncements
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { CURRENT_USER } from '../constants';
import { Announcement, AnnouncementFormData } from '../types';
import { apiClient } from '@/services/api/client';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapAnnouncement = (item: any): Announcement => ({
    id: String(item.id), title: item.title, body: item.body, category: 'general',
    audience: { type: item.audience === 'ALL' ? 'company' : item.audience === 'BRANCH' ? 'branch' : item.audience === 'DEPARTMENT' ? 'department' : 'individual', targets: item.target_branch ? [item.target_branch] : item.target_department ? [item.target_department] : [] },
    priority: item.is_pinned ? 'urgent' : 'normal', requiresAck: false, postedBy: item.posted_by_name || '', postedAt: item.publish_at, expiresAt: item.expires_at, acknowledgedBy: [],
  });

  useEffect(() => {
    apiClient.get('/hr-operations/announcements/active/').then((response) => {
      const items = Array.isArray(response.data) ? response.data : response.data?.results ?? [];
      setAnnouncements(items.map(mapAnnouncement)); setError(null);
    }).catch(() => setError('Failed to load announcements')).finally(() => setLoading(false));
  }, []);

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
  const createAnnouncement = useCallback(async (data: AnnouncementFormData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/hr-operations/announcements/', { title: data.title, body: data.body, audience: data.audience === 'company' ? 'ALL' : data.audience.toUpperCase(), target_branch: data.audience === 'branch' ? data.targets[0] || '' : '', target_department: data.audience === 'department' ? data.targets[0] || '' : '', is_pinned: data.priority === 'urgent', publish_at: new Date().toISOString(), expires_at: data.expiry });
      const newAnnouncement = mapAnnouncement(response.data);
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
