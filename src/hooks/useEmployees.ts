import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../services/api';

export const useEmployees = () => {
  const queryClient = useQueryClient();
  const queryKey = ['employees'];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => employeeApi.getAll().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  const create = useMutation({
    mutationFn: employeeApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      employeeApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: employeeApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const getById = (id: string) =>
    useQuery({
      queryKey: ['employees', id],
      queryFn: () => employeeApi.getById(id).then((res) => res.data),
      enabled: !!id,
    });

  const getDocuments = (id: string) =>
    useQuery({
      queryKey: ['employees', id, 'documents'],
      queryFn: () => employeeApi.getDocuments(id).then((res) => res.data),
      enabled: !!id,
    });

  return {
    employees: data || [],
    isLoading,
    error,
    createEmployee: create.mutateAsync,
    updateEmployee: update.mutateAsync,
    deleteEmployee: remove.mutateAsync,
    getEmployee: getById,
    getEmployeeDocuments: getDocuments,
  };
};