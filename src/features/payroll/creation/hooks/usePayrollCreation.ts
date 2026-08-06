import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resources } from "../../../../services/api/resources";

export interface PayrollRun {
  id: number;
  name: string;
  period_start: string;
  period_end: string;
  period: string;
  status: string;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  total_amount: number;
  employee_count: number;
  created_at: string;
  updated_at: string;
  notes?: string;
}

type PayrollRunInput = {
  name: string;
  period_start: string;
  period_end: string;
  notes?: string;
  currency_code?: string;
};

const mapRun = (run: Record<string, unknown>): PayrollRun => ({
  id: Number(run.id),
  name: String(run.name ?? "Payroll run"),
  period_start: String(run.period_start ?? ""),
  period_end: String(run.period_end ?? ""),
  period: `${String(run.period_start ?? "")} – ${String(run.period_end ?? "")}`,
  status: String(run.status ?? "Draft"),
  total_gross: Number(run.total_gross ?? 0),
  total_deductions: Number(run.total_deductions ?? 0),
  total_net: Number(run.total_net ?? 0),
  total_amount: Number(run.total_net ?? 0),
  employee_count: Number(run.employee_count ?? 0),
  created_at: String(run.created_at ?? ""),
  updated_at: String(run.updated_at ?? ""),
  notes: run.notes ? String(run.notes) : undefined,
});

export function usePayrollCreation() {
  const queryClient = useQueryClient();
  const query = useQuery<PayrollRun[]>({
    queryKey: ["payroll-runs"],
    queryFn: async () => (await resources.payrollRuns.list()).map((run) => mapRun(run as Record<string, unknown>)),
  });

  const createMutation = useMutation({
    mutationFn: (payload: PayrollRunInput) => resources.payrollRuns.create(payload as never),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payroll-runs"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<PayrollRunInput> }) => resources.payrollRuns.patch(id, payload as never),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payroll-runs"] }),
  });

  return {
    runs: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createRun: createMutation.mutate,
    updateRun: updateMutation.mutate,
  };
}
