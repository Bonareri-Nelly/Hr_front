import api from "./axios";

export interface LeaveTypePayload {
  name: string;
  code: string;
  max_days_per_year: number;
  is_paid: boolean;
  requires_attachment?: boolean;
  is_active?: boolean;
}

export interface LeaveRequestPayload {
  employee_id: number | string;
  leave_type_id: number | string;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface LeaveDecisionPayload {
  comment?: string;
  reason?: string;
}

const unwrapList = <T>(data: T[] | { results: T[] }) => (Array.isArray(data) ? data : data.results);

export const leaveApi = {
  listTypes: async () => unwrapList((await api.get("leave/types/")).data),
  createType: async (payload: LeaveTypePayload) => (await api.post("leave/types/", payload)).data,
  listRequests: async () => unwrapList((await api.get("leave/requests/")).data),
  createRequest: async (payload: LeaveRequestPayload) => (await api.post("leave/requests/create/", payload)).data,
  managerApprove: async (id: number | string, payload: LeaveDecisionPayload = {}) => (await api.post(`leave/requests/${id}/manager-approve/`, payload)).data,
  hrApprove: async (id: number | string, payload: LeaveDecisionPayload = {}) => (await api.post(`leave/requests/${id}/hr-approve/`, payload)).data,
  reject: async (id: number | string, payload: LeaveDecisionPayload) => (await api.post(`leave/requests/${id}/reject/`, payload)).data,
};
