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
  benefitPlans: "/benefits/plans/", benefitEnrollments: "/benefits/enrollments/", benefitWindows: "/benefits/windows/", benefitContributions: "/benefits/contributions/",
  contracts: "/contracts/", contractRenewals: "/contract-renewals/", contractTerminations: "/contract-terminations/",
  performanceCycles: "/performance/cycles/", performanceGoals: "/performance/goals/", performanceReviews: "/performance/reviews/", goalProgress: "/performance/progress/",
  hrPerformanceReviews: "/hr-operations/performance-reviews/", hrPerformanceGoals: "/hr-operations/performance-goals/", disciplinaryCases: "/hr-operations/disciplinary-cases/", announcements: "/hr-operations/announcements/", trainings: "/hr-operations/trainings/", trainingEnrollments: "/hr-operations/training-enrollments/",
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
  submitPayroll: (id: number, payload: Record<string, unknown> = {}) => api.post(`/payroll/runs/${id}/submit/`, payload),
  approvePayroll: (id: number, payload: Record<string, unknown> = {}) => api.post(`/payroll/runs/${id}/approve/`, payload),
  finalizePayroll: (id: number, payload: Record<string, unknown> = {}) => api.post(`/payroll/runs/${id}/finalize/`, payload),
  cancelPayroll: (id: number, payload: Record<string, unknown> = {}) => api.post(`/payroll/runs/${id}/cancel/`, payload),
  downloadPayslip: (id: number) => api.get(`/payroll/payslips/${id}/download/`, { responseType: "blob" }),
  enrollBenefit: (payload: Record<string, unknown>) => api.post("/benefits/enroll/", payload),
  approveBenefitEnrollment: (id: number, payload: Record<string, unknown> = {}) => api.post(`/benefits/enrollments/${id}/approve/`, payload),
  rejectBenefitEnrollment: (id: number, payload: Record<string, unknown> = {}) => api.post(`/benefits/enrollments/${id}/reject/`, payload),
  employeeBenefits: (employeeId: number) => api.get(`/benefits/employees/${employeeId}/benefits/`),
  expiringContracts: () => api.get("/contracts/expiring/"),
  employeeContracts: (employeeId: number) => api.get(`/employees/${employeeId}/contracts/`),
  renewContract: (id: number, payload: Record<string, unknown>) => api.post(`/contracts/${id}/renew/`, payload),
  terminateContract: (id: number, payload: Record<string, unknown>) => api.post(`/contracts/${id}/terminate/`, payload),
  activeAnnouncements: () => api.get("/hr-operations/announcements/active/"),
  resolveDisciplinaryCase: (id: number, payload: Record<string, unknown>) => api.post(`/hr-operations/disciplinary-cases/${id}/resolve/`, payload),
  submitHrPerformanceReview: (id: number, payload: Record<string, unknown> = {}) => api.post(`/hr-operations/performance-reviews/${id}/submit/`, payload),
  enrollInTraining: (id: number, payload: Record<string, unknown> = {}) => api.post(`/hr-operations/trainings/${id}/enroll/`, payload),
  submitGoalProgress: (payload: Record<string, unknown>) => api.post("/performance/submit-progress/", payload),
  employeeGoals: (employeeId: number) => api.get(`/performance/employees/${employeeId}/goals/`),
  submitPerformanceReview: (id: number, payload: Record<string, unknown> = {}) => api.post(`/performance/reviews/${id}/submit/`, payload),
  approvePerformanceReviewAsManager: (id: number, payload: Record<string, unknown> = {}) => api.post(`/performance/reviews/${id}/manager-approve/`, payload),
  approvePerformanceReviewAsHr: (id: number, payload: Record<string, unknown> = {}) => api.post(`/performance/reviews/${id}/hr-approve/`, payload),
  finalizePerformanceReview: (id: number, payload: Record<string, unknown> = {}) => api.post(`/performance/reviews/${id}/finalize/`, payload),
};
