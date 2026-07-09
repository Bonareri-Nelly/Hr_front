// src/features/employees/offboarding/hooks/useOffboarding.ts
import { useState, useEffect } from 'react';
import type { OffboardingCase, OffboardingStats, OffboardingFilter } from '../types';
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

  const createCase = async (data: Partial<OffboardingCase>) => {
    try {
      await offboardingService.initiateOffboarding(data);
      await fetchData();
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
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

  return {
    cases,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    refetch,
    createCase,
  };
};

export default useOffboarding;