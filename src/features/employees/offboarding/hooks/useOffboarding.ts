// src/features/employees/offboarding/hooks/useOffboarding.ts
import { useState, useEffect } from 'react';
import type { OffboardingCase, OffboardingStats, OffboardingFilter, UploadedFile } from '../types';
import { offboardingService } from '../services/offboarding.service';

export const useOffboarding = (initialFilters?: OffboardingFilter) => {
  const [cases, setCases] = useState<OffboardingCase[]>([]);
  const [stats, setStats] = useState<OffboardingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<OffboardingFilter>(initialFilters || {});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [casesData, statsData] = await Promise.all([
        offboardingService.getCases(filters),
        offboardingService.getStats(filters),
      ]);
      setCases(casesData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const updateFilters = (newFilters: OffboardingFilter) => {
    setFilters({ ...filters, ...newFilters });
  };

  const refetch = () => {
    fetchData();
  };

  // FIXED: Updated to match the service's initiateOffboarding signature
  const initiateOffboarding = async (data: {
    employee: {
      id: string;
      name: string;
      email: string;
      department: string;
      position: string;
      branchId: string;
      branchName: string;
    };
    exitType: string;
    reason: string;
    lastWorkingDay: string;
    attachments?: UploadedFile[];
  }) => {
    try {
      setLoading(true);
      const newCase = await offboardingService.initiateOffboarding(data);
      setCases(prev => [newCase, ...prev]);
      // Refresh stats
      const newStats = await offboardingService.getStats(filters);
      setStats(newStats);
      return newCase;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cases,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    refetch,
    initiateOffboarding,
  };
};

export default useOffboarding;