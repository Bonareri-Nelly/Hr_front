import api from "./axios";

export interface EmployeePayload {
  employee_number?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  employment_type?: string;
  hire_date?: string;
  basic_salary?: string | number;
  is_active?: boolean;
  [key: string]: unknown;
}

export type EmployeeDto = EmployeePayload & { id: number };

const unwrapList = <T>(data: T[] | { results: T[] }) => (Array.isArray(data) ? data : data.results);

export const employeeApi = {
  list: async () => unwrapList((await api.get<EmployeeDto[] | { results: EmployeeDto[] }>("employees/")).data),
  get: async (id: number | string) => (await api.get<EmployeeDto>(`employees/${id}/`)).data,
  create: async (payload: EmployeePayload) => (await api.post<EmployeeDto>("employees/", payload)).data,
  update: async (id: number | string, payload: Partial<EmployeePayload>) => (await api.patch<EmployeeDto>(`employees/${id}/`, payload)).data,
  remove: async (id: number | string) => api.delete(`employees/${id}/`),
};
