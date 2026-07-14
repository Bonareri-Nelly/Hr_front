// src/features/employees/onboarding/hooks/useOnboarding.ts
import { useState, useEffect } from 'react';
import type { OnboardingCase, OnboardingStats, OnboardingFilter, OnboardingFormData } from '../types';
import { onboardingService } from '../services/onboarding.service';

export const useOnboarding = (initialFilters?: OnboardingFilter) => {
  const [cases, setCases] = useState<OnboardingCase[]>([]);
  const [stats, setStats] = useState<OnboardingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<OnboardingFilter>(initialFilters || {});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [casesData, statsData] = await Promise.all([
        onboardingService.getCases(filters),
        onboardingService.getStats(filters),
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

  const updateFilters = (newFilters: OnboardingFilter) => {
    setFilters({ ...filters, ...newFilters });
  };

  const refetch = () => {
    fetchData();
  };

  const initiateOnboarding = async (data: OnboardingFormData) => {
    try {
      setLoading(true);
      const newCase = await onboardingService.initiateOnboarding(data);
      setCases(prev => [newCase, ...prev]);
      const newStats = await onboardingService.getStats(filters);
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
    initiateOnboarding,
  };
};

export default useOnboarding; 