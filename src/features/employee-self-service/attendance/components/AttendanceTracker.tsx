import { AlertCircle, CheckCircle, Download, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageChatbotWidget from "../../../../components/shared/PageChatbotWidget";
import { actions, resources, type ApiRecord } from "../../../../services/api/resources";
import AttendanceCorrectionModal from "./AttendanceCorrectionModal";
import ClockInOutWidget from "./ClockInOutWidget";

type AttendanceRecord = { id: number; employee: number; date: string; check_in: string | null; check_out: string | null; hours_worked: string | number; status: string };
const currentEmployeeId = () => { try { return Number(JSON.parse(localStorage.getItem("current_user") ?? localStorage.getItem("user") ?? "{}").employee_id) || undefined; } catch { return undefined; } };
const location = () => new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation ? navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }) : reject(new Error("Location access is required to record attendance.")));
const formatStatus = (value: string) => value.replace(/_/g, " ");
const formatElapsed = (milliseconds: number) => { const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000)); const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0"); const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0"); const seconds = (totalSeconds % 60).toString().padStart(2, "0"); return `${hours}:${minutes}:${seconds}`; };

export default function AttendanceTracker() {
  const client = useQueryClient(); const employeeId = currentEmployeeId(); const [notice, setNotice] = useState(""); const [correctionOpen, setCorrectionOpen] = useState(false);
  const employee = useQuery({ queryKey: ["employees", employeeId], queryFn: () => resources.employees.list(), enabled: Boolean(employeeId) });
  const records = useQuery({ queryKey: ["attendance", "records", employeeId], queryFn: () => resources.attendanceRecords.list({ employee: employeeId }), enabled: Boolean(employeeId) });
  const corrections = useQuery({ queryKey: ["attendance", "corrections", employeeId], queryFn: () => resources.correctionRequests.list({ employee: employeeId }), enabled: Boolean(employeeId) });
  const clock = useMutation({ mutationFn: async (event: "in" | "out") => { const pos = await location(); const payload = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy }; return event === "in" ? actions.checkIn(payload) : actions.checkOut(payload); }, onSuccess: () => { setNotice("Attendance updated."); client.invalidateQueries({ queryKey: ["attendance"] }); } });
  const requestCorrection = useMutation({ mutationFn: async (reason: string) => { const record = (records.data as AttendanceRecord[] | undefined)?.find((item) => !item.check_out) ?? (records.data as AttendanceRecord[] | undefined)?.[0]; if (!record) throw new Error("There is no attendance record to correct."); return resources.correctionRequests.create({ attendance_record: record.id, date: record.date, reason } as never); }, onSuccess: () => { setCorrectionOpen(false); setNotice("Correction request sent to HR."); client.invalidateQueries({ queryKey: ["attendance"] }); } });
  const history = (records.data ?? []) as AttendanceRecord[]; const open = history.find((item) => !item.check_out); const corrected = new Set((corrections.data ?? []).map((item) => Number(item.attendance_record))); const [now, setNow] = useState(() => Date.now());
  useEffect(() => { if (!open?.check_in) return; const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, [open?.check_in]);
  const elapsed = open?.check_in ? formatElapsed(now - new Date(open.check_in).getTime()) : new Date(now).toLocaleString();
  const summary = useMemo(() => ({ hours: history.reduce((sum, item) => sum + Number(item.hours_worked || 0), 0), late: history.filter((item) => item.status === "Late").length }), [history]);
  const error = employee.error ?? records.error ?? corrections.error ?? clock.error ?? requestCorrection.error;
  const download = () => { const csv = "Date,Clock in,Clock out,Hours,Status\n" + history.map((item) => [item.date, item.check_in ?? "", item.check_out ?? "", item.hours_worked, item.status].map((x) => `\"${x}\"`).join(",")).join("\n"); const href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); const link = document.createElement("a"); link.href = href; link.download = "my-attendance.csv"; link.click(); URL.revokeObjectURL(href); };
  const profile = employee.data?.find((item: ApiRecord) => Number(item.id) === employeeId);

  return (
    <div className="dashboard-page attendance-page">
      <div className="dashboard-heading">
        <div>
          <p className="page-kicker">Employee self-service</p>
          <h1 className="page-title">My Attendance</h1>
          <p className="page-subtitle">Clock in from your assigned geofenced location and review your live attendance history.</p>
        </div>
        <div className="action-row">
          <button className="button button-secondary" onClick={download} disabled={!history.length}>
            <Download size={15} aria-hidden="true" /> Export CSV
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error.message}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}
      {!employeeId && <div className="alert alert-error">Your account is not linked to an employee profile. Ask HR to link it before you clock in.</div>}

      <div className="metrics">
        <ClockInOutWidget isClockedIn={Boolean(open)} currentTime={open ? `Worked ${elapsed}` : `Ready · ${new Date(now).toLocaleTimeString()}`} onClockIn={() => clock.mutate("in")} onClockOut={() => clock.mutate("out")} disabled={!employeeId || clock.isPending} />
        <div className="metric-cell">
          <p className="metric-label">Total Hours</p>
          <p className="metric-value compact-metric">{summary.hours.toFixed(2)}</p>
          <p className="metric-meta">This period</p>
        </div>
        <div className="metric-cell">
          <p className="metric-label">Late Records</p>
          <p className="metric-value compact-metric">{summary.late}</p>
          <p className="metric-meta">Requires attention</p>
        </div>
        <div className="metric-cell">
          <p className="metric-label">Days Worked</p>
          <p className="metric-value compact-metric">{history.length}</p>
          <p className="metric-meta">Total recorded</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Attendance History</h2>
            <p className="page-subtitle">{String(profile?.full_name ?? "Employee Records")}</p>
          </div>
          <button className="button button-secondary" disabled={!history.length} onClick={() => setCorrectionOpen(true)}>
            <AlertCircle size={15} aria-hidden="true" /> Request correction
          </button>
        </div>
        {records.isLoading ? (
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <LoaderCircle className="mx-auto animate-spin" />
            <p className="page-subtitle" style={{ marginTop: "12px" }}>Loading attendance records…</p>
          </div>
        ) : !history.length ? (
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <p className="page-subtitle">No attendance records yet.</p>
          </div>
        ) : (
          <div className="panel-body table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Correction</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.check_in ? new Date(item.check_in).toLocaleTimeString() : "—"}</td>
                    <td>{item.check_out ? new Date(item.check_out).toLocaleTimeString() : "—"}</td>
                    <td>{Number(item.hours_worked).toFixed(2)}</td>
                    <td><span className={`pill pill-${item.status === "Late" ? "warning" : item.status === "Absent" ? "danger" : "success"}`}>{formatStatus(item.status)}</span></td>
                    <td>{corrected.has(item.id) ? <><CheckCircle size={14} className="inline" /> Requested</> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AttendanceCorrectionModal open={correctionOpen} onClose={() => setCorrectionOpen(false)} onSubmit={(reason) => requestCorrection.mutate(reason)} />
      <PageChatbotWidget page="attendance" role="Employee" contextSummary={`${summary.hours.toFixed(1)} attendance hours recorded.`} quickPrompts={["How do I correct a missed clock-in?"]} />
    </div>
  );
}
