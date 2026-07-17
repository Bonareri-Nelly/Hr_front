import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { performanceApi } from '../services/api';

export const usePerformance = () => {
  const queryClient = useQueryClient();

  const getCycles = () =>
    useQuery({
      queryKey: ['performance', 'cycles'],
      queryFn: () => performanceApi.getCycles().then((res) => res.data),
    });

  const createCycle = useMutation({
    mutationFn: performanceApi.createCycle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['performance', 'cycles'] }),
  });

  const getGoals = (employeeId?: string) =>
    useQuery({
      queryKey: ['performance', 'goals', employeeId],
      queryFn: () => performanceApi.getGoals(employeeId).then((res) => res.data),
    });

  const createGoal = useMutation({
    mutationFn: performanceApi.createGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['performance', 'goals'] }),
  });

  const getReviews = (employeeId?: string) =>
    useQuery({
      queryKey: ['performance', 'reviews', employeeId],
      queryFn: () => performanceApi.getReviews(employeeId).then((res) => res.data),
    });

  const createReview = useMutation({
    mutationFn: performanceApi.createReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['performance', 'reviews'] }),
  });

  const getRatingHistory = (employeeId: string) =>
    useQuery({
      queryKey: ['performance', 'rating-history', employeeId],
      queryFn: () => performanceApi.getRatingHistory(employeeId).then((res) => res.data),
      enabled: !!employeeId,
    });

  return {
    getCycles,
    createCycle: createCycle.mutateAsync,
    getGoals,
    createGoal: createGoal.mutateAsync,
    getReviews,
    createReview: createReview.mutateAsync,
    getRatingHistory,
  };
};