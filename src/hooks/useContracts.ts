import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractApi } from '../services/api';

export const useContracts = () => {
  const queryClient = useQueryClient();
  const queryKey = ['contracts'];
  const contractType: Record<string, string> = { PERMANENT: 'Employment', FIXED_TERM: 'Contractor', PROBATION: 'Probation', INTERNSHIP: 'Internship', CONSULTANCY: 'Consultancy' };
  const contractStatus: Record<string, string> = { DRAFT: 'Draft', ACTIVE: 'Active', EXPIRED: 'Expired', TERMINATED: 'Terminated', RENEWED: 'Active', CANCELLED: 'Terminated' };
  const mapContract = (contract: any) => ({
    ...contract,
    title: contract.contract_number,
    type: contractType[contract.contract_type] || contract.contract_type,
    status: contractStatus[contract.status] || contract.status,
    employeeName: contract.employee_name,
    employeeId: String(contract.employee),
    startDate: contract.start_date,
    endDate: contract.end_date,
    salary: Number(contract.basic_salary || 0),
    currency: 'KES',
    position: '',
    department: '',
    employeeEmail: '',
    probationPeriod: 0,
    noticePeriod: 0,
    documents: contract.document ? [{ name: 'Contract document', type: 'document', size: '', uploadDate: contract.created_at, url: contract.document }] : [],
    signedByEmployee: Boolean(contract.approved_at),
    signedByEmployer: Boolean(contract.approved_at),
    createdBy: contract.created_by_name || '',
    createdAt: contract.created_at,
    updatedAt: contract.updated_at,
    notes: contract.terms,
    history: [],
  });

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => contractApi.getAll().then((res) => {
      const payload = res.data;
      const contracts = Array.isArray(payload) ? payload : payload.results || [];
      return contracts.map(mapContract);
    }),
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
    amendContract: update.mutateAsync,
    deleteContract: remove.mutateAsync,
    renewContract: renew.mutateAsync,
    terminateContract: terminate.mutateAsync,
    expiringContracts: getExpiring.data || [],
    getEmployeeContracts: getByEmployee,
  };
};
