import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractApi } from '../services/api';

export const useContracts = () => {
  const queryClient = useQueryClient();
  const queryKey = ['contracts'];
  const contractType: Record<string, string> = { PERMANENT: 'Employment', FIXED_TERM: 'Contractor', PROBATION: 'Probation', INTERNSHIP: 'Internship', CONSULTANCY: 'Consultancy' };
  const contractStatus: Record<string, string> = { DRAFT: 'Draft', PENDING: 'Pending', UNDER_REVIEW: 'Under Review', ACTIVE: 'Active', EXPIRED: 'Expired', TERMINATED: 'Terminated', RENEWED: 'Active', CANCELLED: 'Terminated' };
  const mapContract = (contract: any) => {
    const employee = contract.employee_detail || contract.employee_data || (typeof contract.employee === 'object' ? contract.employee : {});
    const employeeName = contract.employee_name || employee.full_name || [employee.first_name, employee.last_name].filter(Boolean).join(' ');
    const department = contract.department_name || contract.department?.name || (typeof contract.department === 'string' ? contract.department : '') || employee.department_name || employee.department?.name || (typeof employee.department === 'string' ? employee.department : '');
    const position = contract.position || contract.job_title || employee.position || employee.job_title || '';
    const documents = contract.documents || (contract.document ? [{ name: contract.document_name || 'Contract document', type: 'document', size: '', uploadDate: contract.created_at, url: contract.document }] : []);

    return {
    ...contract,
    title: contract.contract_number || contract.title || `Contract ${contract.id}`,
    type: contractType[contract.contract_type] || contract.contract_type || 'Employment',
    status: contractStatus[contract.status] || contract.status || 'Draft',
    employeeName: employeeName || 'Unknown employee',
    employeeId: String(contract.employee_id || employee.id || contract.employee || ''),
    startDate: contract.start_date || contract.effective_date || '',
    endDate: contract.end_date || contract.expiry_date || '',
    salary: Number(contract.basic_salary ?? contract.salary ?? 0),
    currency: contract.currency || contract.salary_currency || 'KES',
    position,
    department,
    employeeEmail: contract.employee_email || employee.email || '',
    probationPeriod: contract.probation_end_date ? Math.max(0, Math.round((new Date(contract.probation_end_date).getTime() - new Date(contract.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))) : 0,
    noticePeriod: contract.termination?.notice_period_days || 0,
    documents,
    signedByEmployee: Boolean(contract.signed_by_employee),
    signedByEmployer: Boolean(contract.signed_by_employer),
    signedDate: contract.signed_date,
    createdBy: contract.created_by_name || '',
    createdAt: contract.created_at,
    updatedAt: contract.updated_at,
    notes: contract.terms,
    history: contract.history || contract.audit_history || [],
  };
  };

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => contractApi.getAll().then((res) => {
      const payload = res.data;
      const rawContracts = Array.isArray(payload)
        ? payload
        : payload.results || payload.contracts || payload.data?.results || payload.data?.contracts || payload.data || [];
      const contracts = Array.isArray(rawContracts) ? rawContracts : [];
      return contracts.map(mapContract);
    }),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
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

  const approve = useMutation({
    mutationFn: contractApi.approve,
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
    approveContract: approve.mutateAsync,
    refreshContracts: () => queryClient.invalidateQueries({ queryKey }),
    expiringContracts: getExpiring.data || [],
    getEmployeeContracts: getByEmployee,
  };
};
