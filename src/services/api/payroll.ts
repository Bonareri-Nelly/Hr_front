import api from "./axios";

export interface PayrollGeneratePayload {
  month: number;
  year: number;
}

export interface PayrollRunDto {
  id: number | string;
  month?: number;
  year?: number;
  status?: string;
  [key: string]: unknown;
}

export interface PayslipDto {
  id: number | string;
  employee?: number | string;
  employee_id?: number | string;
  payroll_run?: number | string;
  payroll_run_id?: number | string;
  pay_period?: string;
  gross_pay?: number | string;
  allowances?: unknown;
  deductions?: unknown;
  net_pay?: number | string;
  status?: string;
  disbursed_at?: string;
  [key: string]: unknown;
}

const unwrapList = <T>(data: T[] | { results: T[] }) => (Array.isArray(data) ? data : data.results);

export const payrollApi = {
  generate: async (payload: PayrollGeneratePayload) => (await api.post<{ payroll?: PayrollRunDto } & PayrollRunDto>("payroll/generate/", payload)).data,
  listRuns: async () => unwrapList((await api.get<PayrollRunDto[] | { results: PayrollRunDto[] }>("payroll/runs/")).data),
  listPayslips: async () => unwrapList((await api.get<PayslipDto[] | { results: PayslipDto[] }>("payroll/payslips/")).data),
  listBankPayments: async () => unwrapList((await api.get("payroll/bank-payments/")).data),
  listComponents: async () => unwrapList((await api.get("payroll/components/")).data),
  listCurrencies: async () => unwrapList((await api.get("payroll/currencies/")).data),
  listPolicies: async () => unwrapList((await api.get("payroll/policies/")).data),
};
