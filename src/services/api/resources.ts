import api from "./api";

export type ApiRecord = Record<string, unknown> & { id: number };
export type ListParams = Record<string, string | number | boolean | undefined>;

/** All REST collections published by the checked-in OpenAPI schema. */
export const apiPaths = {
  branches: "/branches/", departments: "/departments/", designations: "/designations/",
  employees: "/employees/", documents: "/documents/", education: "/education/", workExperience: "/work-experience/",
  dependants: "/dependants/", certifications: "/certifications/", skills: "/skills/", bankAccounts: "/bank-accounts/", assets: "/assets/",
  workLocations: "/attendance/work-locations/", shifts: "/attendance/shifts/", attendanceRecords: "/attendance/records/",
  locationLogs: "/attendance/location-logs/", correctionRequests: "/attendance/correction-requests/", attendanceAssignments: "/attendance/employee-attendance-assignments/",
  leaveTypes: "/leave/types/", leaveBalances: "/leave/balances/", leaveRequests: "/leave/requests/", leaveApprovals: "/leave/approvals/", leaveAttachments: "/leave/attachments/", publicHolidays: "/leave/public-holidays/",
  payrollRuns: "/payroll/runs/", payslips: "/payroll/payslips/", allowances: "/payroll/allowances/", deductions: "/payroll/deductions/", bankPayments: "/payroll/bank-payments/", payComponents: "/payroll/components/", employeeComponents: "/payroll/employee-components/", taxBands: "/payroll/tax-bands/", statutoryRates: "/payroll/statutory-rates/", currencies: "/payroll/currencies/", exchangeRates: "/payroll/exchange-rates/", payrollPolicies: "/payroll/policies/",
  performanceReviews: "/hr-operations/performance-reviews/", performanceGoals: "/hr-operations/performance-goals/", disciplinaryCases: "/hr-operations/disciplinary-cases/", announcements: "/hr-operations/announcements/", trainings: "/hr-operations/trainings/", trainingEnrollments: "/hr-operations/training-enrollments/",
} as const;

type ApiPath = (typeof apiPaths)[keyof typeof apiPaths];
const normaliseList = <T>(data: T[] | { results?: T[] }) => Array.isArray(data) ? data : data.results ?? [];

export const resource = <T extends ApiRecord = ApiRecord>(path: ApiPath) => ({
  list: async (params?: ListParams) => normaliseList<T>((await api.get<T[] | { results?: T[] }>(path, { params })).data),
  get: async (id: number) => (await api.get<T>(`${path}${id}/`)).data,
  create: async (payload: Omit<T, "id"> | FormData) => (await api.post<T>(path, payload)).data,
  update: async (id: number, payload: Partial<T>) => (await api.put<T>(`${path}${id}/`, payload)).data,
  patch: async (id: number, payload: Partial<T>) => (await api.patch<T>(`${path}${id}/`, payload)).data,
  remove: async (id: number) => { await api.delete(`${path}${id}/`); },
});

export const resources = Object.fromEntries(Object.entries(apiPaths).map(([name, path]) => [name, resource(path)])) as Record<keyof typeof apiPaths, ReturnType<typeof resource>>;

export const actions = {
  checkIn: (payload: Record<string, unknown>) => api.post("/attendance/check-in/", payload),
  checkOut: (payload: Record<string, unknown>) => api.post("/attendance/check-out/", payload),
  createLeaveRequest: (payload: Record<string, unknown>) => api.post("/leave/requests/create/", payload),
  approveLeaveAsManager: (id: number, payload: Record<string, unknown> = {}) => api.post(`/leave/requests/${id}/manager-approve/`, payload),
  approveLeaveAsHr: (id: number, payload: Record<string, unknown> = {}) => api.post(`/leave/requests/${id}/hr-approve/`, payload),
  rejectLeave: (id: number, payload: Record<string, unknown>) => api.post(`/leave/requests/${id}/reject/`, payload),
  generatePayroll: (payload: Record<string, unknown>) => api.post("/payroll/generate/", payload),
  activeAnnouncements: () => api.get("/hr-operations/announcements/active/"),
  resolveDisciplinaryCase: (id: number, payload: Record<string, unknown>) => api.post(`/hr-operations/disciplinary-cases/${id}/resolve/`, payload),
  submitPerformanceReview: (id: number, payload: Record<string, unknown> = {}) => api.post(`/hr-operations/performance-reviews/${id}/submit/`, payload),
  enrollInTraining: (id: number, payload: Record<string, unknown> = {}) => api.post(`/hr-operations/trainings/${id}/enroll/`, payload),
};
