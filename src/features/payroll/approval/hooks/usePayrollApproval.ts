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

export interface PayrollItem {
  id: number;
  employee: number;
  amount: number;
  status: string;
  run: number;
  breakdown: {
    basic_salary: number;
    allowances: number;
    deductions: number;
    net_pay: number;
  };
}

export function usePayrollApproval() {
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

  const { data: items = [], isLoading: itemsLoading, error: itemsError } = useQuery<PayrollItem[]>({
    queryKey: ["payroll-items"],
    queryFn: async () => {
      const data = await resources.payComponents.list();
      return (data as any[]).map((item: any) => ({
        id: item.id,
        employee: item.employee || 0,
        amount: item.amount || 0,
        status: item.status || "pending",
        run: item.run || 0,
        breakdown: {
          basic_salary: item.basic_salary || 0,
          allowances: item.allowances || 0,
          deductions: item.deductions || 0,
          net_pay: item.net_pay || 0,
        },
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
      queryClient.invalidateQueries({ queryKey: ["payroll-items"] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) =>
      resources.payrollRuns.patch(id, { status: "Approved" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-runs"] });
      queryClient.invalidateQueries({ queryKey: ["payroll-items"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) =>
      resources.payrollRuns.patch(id, { status: "Rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-runs"] });
      queryClient.invalidateQueries({ queryKey: ["payroll-items"] });
    },
  });

  return {
    runs,
    items,
    isLoading: runsLoading || itemsLoading,
    error: runsError || itemsError,
    createRun: createMutation.mutate,
    updateRun: updateMutation.mutate,
    approveRun: approveMutation.mutate,
    rejectRun: rejectMutation.mutate,
  };
}
