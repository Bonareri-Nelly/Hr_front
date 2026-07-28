import { apiClient } from "../../../../services/api";
import type { OffboardingCase, OffboardingFilter, OffboardingStats } from "../types";

type ApiCase = Record<string, unknown>;
const list = <T>(data: T[] | { results?: T[] }) => Array.isArray(data) ? data : data.results ?? [];

const mapCase = (item: ApiCase): OffboardingCase => {
  const lastWorkingDay = String(item.last_working_day ?? "");
  const created = String(item.created_at ?? "").slice(0, 10);
  const daysUntilLastDay = lastWorkingDay ? Math.ceil((new Date(lastWorkingDay).getTime() - Date.now()) / 86400000) : 0;
  const status = String(item.status ?? "PENDING").toLowerCase().replace(/_/g, "-") as OffboardingCase["status"];
  return { id: String(item.id), employeeId: String(item.employee), employeeName: String(item.employee_name ?? ""), employeeEmail: String(item.employee_email ?? ""), branchId: "", branchName: String(item.branch_name ?? ""), department: String(item.department_name ?? ""), position: String(item.position ?? ""), exitType: String(item.exit_type ?? "RESIGNATION").toLowerCase().replace(/_/g, "-") as OffboardingCase["exitType"], reason: String(item.reason ?? ""), lastWorkingDay, noticePeriodStatus: String(item.notice_period_status ?? "FULL").toLowerCase() as OffboardingCase["noticePeriodStatus"], initiatedBy: String(item.initiated_by ?? ""), initiatedByName: String(item.initiated_by_name ?? ""), initiatedDate: created, status, progress: { total: 0, completed: 0, percentage: 0 }, caseCreated: created, caseUpdated: String(item.updated_at ?? "").slice(0, 10), dateCompleted: item.completed_at ? String(item.completed_at).slice(0, 10) : undefined, hasOverdueItems: status !== "completed" && daysUntilLastDay < 0, daysUntilLastDay, attachments: [] };
};

export const offboardingService = {
  async getCases(filters: OffboardingFilter = {}): Promise<OffboardingCase[]> {
    const { data } = await apiClient.get<ApiCase[] | { results?: ApiCase[] }>("/hr-operations/offboarding-cases/", { params: { search: filters.searchTerm, status: filters.status?.replace("-", "_").toUpperCase() } });
    return list(data).map(mapCase);
  },
  async getStats(filters: OffboardingFilter = {}): Promise<OffboardingStats> {
    const cases = await this.getCases(filters);
    return { totalCases: cases.length, pending: cases.filter((item) => item.status === "pending").length, inProgress: cases.filter((item) => item.status === "in-progress").length, completed: cases.filter((item) => item.status === "completed").length, overdue: cases.filter((item) => item.status === "overdue" || item.hasOverdueItems).length, byBranch: [], byExitType: [], byDepartment: [], avgTimeToComplete: 0, monthlyTrend: [] };
  },
  async initiateOffboarding(data: { employee: { id: string }; exitType: string; reason: string; lastWorkingDay: string }): Promise<OffboardingCase> {
    const response = await apiClient.post("/hr-operations/offboarding-cases/", { employee: Number(data.employee.id), exit_type: data.exitType.replace(/-/g, "_").toUpperCase(), reason: data.reason, last_working_day: data.lastWorkingDay });
    return mapCase(response.data);
  },
};

export default offboardingService;
