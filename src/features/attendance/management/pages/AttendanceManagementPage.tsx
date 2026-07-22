import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actions, resources, type ApiRecord } from "@/services/api/resources";

const stringValue = (record: ApiRecord, key: string) => String(record[key] ?? "—");

export default function AttendanceManagementPage() {
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState("");
  const [message, setMessage] = useState("");
  const records = useQuery({ queryKey: ["attendance", "records"], queryFn: () => resources.attendanceRecords.list() });
  const employees = useQuery({ queryKey: ["employees"], queryFn: () => resources.employees.list() });
  const checkIn = useMutation({
    mutationFn: async () => {
      if (!employeeId) throw new Error("Choose an employee before checking in.");
      if (!navigator.geolocation) throw new Error("Location access is required for check-in.");
      const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 }));
      return actions.checkIn({ employee_id: Number(employeeId), latitude: position.coords.latitude, longitude: position.coords.longitude });
    },
    onSuccess: ({ data }) => { setMessage(String(data.message ?? "Check-in successful.")); queryClient.invalidateQueries({ queryKey: ["attendance", "records"] }); },
  });
  const checkOut = useMutation({
    mutationFn: async () => {
      if (!employeeId) throw new Error("Choose an employee before checking out.");
      if (!navigator.geolocation) throw new Error("Location access is required for check-out.");
      const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 }));
      return actions.checkOut({ employee_id: Number(employeeId), latitude: position.coords.latitude, longitude: position.coords.longitude });
    },
    onSuccess: ({ data }) => { setMessage(String(data.message ?? "Check-out successful.")); queryClient.invalidateQueries({ queryKey: ["attendance", "records"] }); },
  });
  const error = checkIn.error ?? checkOut.error ?? records.error ?? employees.error;
  const selectedEmployee = useMemo(() => employees.data?.find((employee) => String(employee.id) === employeeId), [employees.data, employeeId]);

  return <div className="dashboard-page" style={{ display: "grid", gap: 20 }}>
    <div><h1 className="page-title">Attendance Management</h1><p className="page-subtitle">Review attendance records and submit geofence-validated clock events.</p></div>
    {error && <div className="alert alert-error">{error.message}</div>}
    {message && <div className="alert alert-success">{message}</div>}
    <section className="panel"><div className="panel-body" style={{ display: "grid", gap: 14, maxWidth: 620 }}>
      <label>Employee<select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} disabled={employees.isLoading}><option value="">{employees.isLoading ? "Loading employees…" : "Select employee"}</option>{employees.data?.map((employee) => <option value={employee.id} key={employee.id}>{stringValue(employee, "full_name") || `${stringValue(employee, "first_name")} ${stringValue(employee, "last_name")}`}</option>)}</select></label>
      {selectedEmployee && <small>Clock events use this employee’s configured work location and shift.</small>}
      <div style={{ display: "flex", gap: 12 }}><button className="button button-primary" disabled={checkIn.isPending || checkOut.isPending} onClick={() => checkIn.mutate()}>{checkIn.isPending ? "Checking in…" : "Check in"}</button><button className="button button-secondary" disabled={checkIn.isPending || checkOut.isPending} onClick={() => checkOut.mutate()}>{checkOut.isPending ? "Checking out…" : "Check out"}</button></div>
    </div></section>
    <section className="panel"><div className="panel-header"><h2 className="panel-title">Attendance records</h2></div><div className="panel-body table-wrap"><table className="table"><thead><tr><th>Employee</th><th>Date</th><th>Check in</th><th>Check out</th><th>Status</th></tr></thead><tbody>{records.isLoading ? <tr><td colSpan={5}>Loading attendance records…</td></tr> : records.data?.length ? records.data.map((record) => <tr key={record.id}><td>{stringValue(record, "employee_name") || stringValue(record, "employee")}</td><td>{stringValue(record, "date")}</td><td>{stringValue(record, "check_in_time")}</td><td>{stringValue(record, "check_out_time")}</td><td>{stringValue(record, "status")}</td></tr>) : <tr><td colSpan={5}>No attendance records found.</td></tr>}</tbody></table></div></section>
  </div>;
}
