import api from "./axios";

export interface BranchPayload {
  name?: string;
  code?: string;
  location?: string;
  phone_number?: string;
  email?: string;
  is_active?: boolean;
  [key: string]: unknown;
}

export interface DepartmentPayload {
  branch?: number;
  name?: string;
  code?: string;
  description?: string;
  is_active?: boolean;
  [key: string]: unknown;
}

export interface DesignationPayload {
  department?: number;
  title?: string;
  description?: string;
  is_active?: boolean;
  [key: string]: unknown;
}

export type BranchDto = BranchPayload & { id: number };
export type DepartmentDto = DepartmentPayload & { id: number };
export type DesignationDto = DesignationPayload & { id: number };

const unwrapList = <T>(data: T[] | { results: T[] }) => (Array.isArray(data) ? data : data.results);

export const branchApi = {
  list: async () => unwrapList((await api.get<BranchDto[] | { results: BranchDto[] }>("branches/")).data),
  get: async (id: number | string) => (await api.get<BranchDto>(`branches/${id}/`)).data,
  create: async (payload: BranchPayload) => (await api.post<BranchDto>("branches/", payload)).data,
  update: async (id: number | string, payload: Partial<BranchPayload>) => (await api.patch<BranchDto>(`branches/${id}/`, payload)).data,
  remove: async (id: number | string) => api.delete(`branches/${id}/`),
};

export const departmentApi = {
  list: async () => unwrapList((await api.get<DepartmentDto[] | { results: DepartmentDto[] }>("departments/")).data),
  get: async (id: number | string) => (await api.get<DepartmentDto>(`departments/${id}/`)).data,
  create: async (payload: DepartmentPayload) => (await api.post<DepartmentDto>("departments/", payload)).data,
  update: async (id: number | string, payload: Partial<DepartmentPayload>) => (await api.patch<DepartmentDto>(`departments/${id}/`, payload)).data,
  remove: async (id: number | string) => api.delete(`departments/${id}/`),
};

export const designationApi = {
  list: async () => unwrapList((await api.get<DesignationDto[] | { results: DesignationDto[] }>("designations/")).data),
  get: async (id: number | string) => (await api.get<DesignationDto>(`designations/${id}/`)).data,
  create: async (payload: DesignationPayload) => (await api.post<DesignationDto>("designations/", payload)).data,
  update: async (id: number | string, payload: Partial<DesignationPayload>) => (await api.patch<DesignationDto>(`designations/${id}/`, payload)).data,
  remove: async (id: number | string) => api.delete(`designations/${id}/`),
};
