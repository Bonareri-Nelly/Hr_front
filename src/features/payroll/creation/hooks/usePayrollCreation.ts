import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resources } from "../../../../services/api/resources";

export interface PayrollRun {
  id: number;
  name: string;
  period: string;
  status: string;
  total_amount: number;
  employee_count: number;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export function usePayrollCreation() {
  const queryClient = useQueryClient();

  const { data: runs = [], isLoading: runsLoading, error: runsError } = useQuery<PayrollRun[]>({
    queryKey: ["payroll-runs"],
    queryFn: async () => {
      const data = await resources.payrollRuns.list();
      return (data as any[]).map((run: any) => ({
        id: run.id,
        name: run.name,
        period: run.period,
        status: run.status,
        total_amount: run.total_amount,
        employee_count: run.employee_count,
        created_at: run.created_at,
        updated_at: run.updated_at,
        notes: run.notes,
      }));
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<PayrollRun>) => resources.payrollRuns.create(payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-runs"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<PayrollRun> }) =>
      resources.payrollRuns.patch(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-runs"] });
    },
  });

  return {
    runs,
    isLoading: runsLoading,
    error: runsError,
    createRun: createMutation.mutate,
    updateRun: updateMutation.mutate,
  };
}
