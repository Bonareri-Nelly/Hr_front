import api from "./axios";

export interface AttendanceRecordDto {
  id: number | string;
  employee?: number | string;
  employee_id?: number | string;
  date?: string;
  clock_in?: string | null;
  clock_out?: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  hours_worked?: number | string;
  status?: string;
  correction_requested?: boolean;
  [key: string]: unknown;
}

export interface CheckInPayload {
  employee_id: number | string;
  work_location_id: number | string;
  shift_id: number | string;
  latitude: string;
  longitude: string;
}

export interface CheckOutPayload {
  employee_id: number | string;
  latitude: string;
  longitude: string;
}

const unwrapList = <T>(data: T[] | { results: T[] }) => (Array.isArray(data) ? data : data.results);

export const attendanceApi = {
  listRecords: async () => unwrapList((await api.get<AttendanceRecordDto[] | { results: AttendanceRecordDto[] }>("attendance/records/")).data),
  checkIn: async (payload: CheckInPayload) => (await api.post<{ attendance?: AttendanceRecordDto } & AttendanceRecordDto>("attendance/check-in/", payload)).data,
  checkOut: async (payload: CheckOutPayload) => (await api.post<{ attendance?: AttendanceRecordDto } & AttendanceRecordDto>("attendance/check-out/", payload)).data,
  listWorkLocations: async () => unwrapList((await api.get("attendance/work-locations/")).data),
};
