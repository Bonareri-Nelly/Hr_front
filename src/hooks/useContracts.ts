import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractApi } from '../services/api';

export const useContracts = () => {
  const queryClient = useQueryClient();
  const queryKey = ['contracts'];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => contractApi.getAll().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  const create = useMutation({
    mutationFn: contractApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      contractApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: contractApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const renew = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      contractApi.renew(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const terminate = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      contractApi.terminate(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const getExpiring = useQuery({
    queryKey: ['contracts', 'expiring'],
    queryFn: () => contractApi.getExpiring().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
  });

  const getByEmployee = (employeeId: string) =>
    useQuery({
      queryKey: ['contracts', 'employee', employeeId],
      queryFn: () => contractApi.getByEmployee(employeeId).then((res) => res.data),
      enabled: !!employeeId,
    });

  return {
    contracts: data || [],
    isLoading,
    error,
    createContract: create.mutateAsync,
    updateContract: update.mutateAsync,
    deleteContract: remove.mutateAsync,
    renewContract: renew.mutateAsync,
    terminateContract: terminate.mutateAsync,
    expiringContracts: getExpiring.data || [],
    getEmployeeContracts: getByEmployee,
  };
};