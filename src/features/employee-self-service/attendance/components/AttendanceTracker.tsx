import { AlertCircle, CheckCircle, Download, Filter, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageChatbotWidget from "../../../../components/shared/PageChatbotWidget";
import { actions, resources, type ApiRecord } from "../../../../services/api/resources";
import { executiveTheme } from "../../../../theme/executiveTheme";
import AttendanceCorrectionModal from "./AttendanceCorrectionModal";
import ClockInOutWidget from "./ClockInOutWidget";

type AttendanceRecord = {
  id: number;
  employee: number;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  total_hours: string | number;
  status: string;
};

const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") ?? "null") as { id?: number } | null;
    return user?.id;
  } catch {
    return undefined;
  }
};

const getLocation = () => new Promise<GeolocationPosition>((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error("Location access is required to record attendance."));
    return;
  }
  navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
});

const formatStatus = (status: string) => status.replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase());
const employeeName = (employee: ApiRecord) => String(employee.full_name ?? [employee.first_name, employee.middle_name, employee.last_name].filter(Boolean).join(" ") ?? "Employee");

export default function AttendanceTracker() {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState("");
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const userId = getCurrentUserId();
  const employees = useQuery({ queryKey: ["employees"], queryFn: () => resources.employees.list() });
  const employee = useMemo(() => employees.data?.find((item) => Number(item.user) === userId), [employees.data, userId]);
  const employeeId = typeof employee?.id === "number" ? employee.id : undefined;
  const records = useQuery({
    queryKey: ["attendance", "records", employeeId],
    queryFn: () => resources.attendanceRecords.list({ employee: employeeId }),
    enabled: Boolean(employeeId),
  });
  const corrections = useQuery({
    queryKey: ["attendance", "corrections", employeeId],
    queryFn: () => resources.correctionRequests.list({ employee: employeeId }),
    enabled: Boolean(employeeId),
  });
  const clockEvent = useMutation({
    mutationFn: async (event: "in" | "out") => {
      if (!employeeId) throw new Error("Your signed-in account is not linked to an employee profile.");
      const position = await getLocation();
      const payload = { employee_id: employeeId, latitude: position.coords.latitude, longitude: position.coords.longitude };
      return event === "in" ? actions.checkIn(payload) : actions.checkOut(payload);
    },
    onSuccess: ({ data }) => {
      setNotice(String(data.message ?? "Attendance updated."));
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
  const submitCorrection = useMutation({
    mutationFn: async (reason: string) => {
      const target = (records.data as AttendanceRecord[] | undefined)?.find((record) => !record.check_out_time) ?? (records.data as AttendanceRecord[] | undefined)?.[0];
      if (!target) throw new Error("There is no attendance record available to correct.");
      return resources.correctionRequests.create({ attendance: target.id, reason } as never);
    },
    onSuccess: () => {
      setCorrectionOpen(false);
      setNotice("Correction request sent to HR for review.");
      queryClient.invalidateQueries({ queryKey: ["attendance", "corrections"] });
    },
  });

  const attendanceRecords = ((records.data ?? []) as AttendanceRecord[]).filter((record) => record.employee === employeeId);
  const visibleRecords = attendanceRecords.filter((record) => statusFilter === "all" || record.status.toLowerCase() === statusFilter);
  const openRecord = attendanceRecords.find((record) => !record.check_out_time);
  const correctedIds = new Set((corrections.data ?? []).map((request) => Number(request.attendance)));
  const summary = useMemo(() => ({
    totalHours: attendanceRecords.reduce((sum, record) => sum + Number(record.total_hours ?? 0), 0),
    late: attendanceRecords.filter((record) => record.status === "LATE").length,
    absent: attendanceRecords.filter((record) => record.status === "ABSENT").length,
  }), [attendanceRecords]);
  const error = employees.error ?? records.error ?? corrections.error ?? clockEvent.error ?? submitCorrection.error;

  const exportRecords = () => {
    const header = "Date,Clock in,Clock out,Hours,Status\n";
    const rows = attendanceRecords.map((record) => [record.date, record.check_in_time ?? "", record.check_out_time ?? "", record.total_hours, formatStatus(record.status)].map((value) => `"${value}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([header + rows], { type: "text/csv" }));
    const link = document.createElement("a"); link.href = url; link.download = "my-attendance.csv"; link.click(); URL.revokeObjectURL(url);
  };

  return <div className={`${executiveTheme.page} attendance-page`}><div className={executiveTheme.shell}>
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className={executiveTheme.eyebrow}>Employee self-service</p><h1 className={executiveTheme.title}>My attendance</h1><p className={executiveTheme.subtitle}>Clock in or out from your assigned work location, review live records, and submit corrections for HR review.</p></div><button className={executiveTheme.buttonSecondary} onClick={exportRecords} disabled={!attendanceRecords.length}><Download size={16} /> Export CSV</button></header>
    {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error.message}</div>}
    {notice && <div className="rounded-2xl border border-[#c8a45d]/30 bg-[#c8a45d]/10 p-4 text-sm text-[#f1d99b]">{notice}</div>}
    {!employees.isLoading && !employee && <div className={`${executiveTheme.card} p-5 text-sm text-[#c9d3df]`}>Your user account is not yet linked to an employee profile. Ask HR to link your profile before recording attendance.</div>}
    <div className="grid gap-4 lg:grid-cols-4"><ClockInOutWidget isClockedIn={Boolean(openRecord)} currentTime={new Date().toLocaleString()} onClockIn={() => clockEvent.mutate("in")} onClockOut={() => clockEvent.mutate("out")} disabled={!employeeId || clockEvent.isPending} /><div className={`${executiveTheme.cardSoft} p-5`}><p className={executiveTheme.eyebrow}>Total hours</p><strong className="text-3xl text-[#c8a45d]">{summary.totalHours.toFixed(1)}</strong></div><div className={`${executiveTheme.cardSoft} p-5`}><p className={executiveTheme.eyebrow}>Late count</p><strong className="text-3xl">{summary.late}</strong></div><div className={`${executiveTheme.cardSoft} p-5`}><p className={executiveTheme.eyebrow}>Absences</p><strong className="text-3xl">{summary.absent}</strong></div></div>
    <section className={`${executiveTheme.card} overflow-hidden`}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5"><div><h2 className="text-xl font-bold">Attendance history</h2>{employee && <p className="mt-1 text-sm text-[#c9d3df]">{employeeName(employee)}</p>}</div><div className="flex items-center gap-2"><Filter size={16} className="text-[#c8a45d]" /><select className={executiveTheme.input} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="present">Present</option><option value="late">Late</option><option value="absent">Absent</option><option value="on_leave">On leave</option></select><button className={executiveTheme.buttonPrimary} onClick={() => setCorrectionOpen(true)} disabled={!attendanceRecords.length}><AlertCircle size={16} /> Request correction</button></div></div>{records.isLoading ? <div className="flex items-center justify-center gap-2 p-10 text-[#c9d3df]"><LoaderCircle className="animate-spin" size={18} /> Loading attendance records…</div> : visibleRecords.length === 0 ? <div className="p-10 text-center text-[#c9d3df]">No attendance records yet.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-widest text-[#8fa0b8]"><tr><th className="p-4">Date</th><th>Clock in</th><th>Clock out</th><th>Hours</th><th>Status</th><th>Correction</th></tr></thead><tbody>{visibleRecords.map((record) => <tr key={record.id} className="border-t border-white/5"><td className="p-4">{record.date}</td><td>{record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString() : "—"}</td><td>{record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : "—"}</td><td>{Number(record.total_hours ?? 0).toFixed(2)}</td><td><span className={executiveTheme.badge}>{formatStatus(record.status)}</span></td><td>{correctedIds.has(record.id) ? <span className="text-[#c8a45d]"><CheckCircle size={14} className="inline" /> Requested</span> : "—"}</td></tr>)}</tbody></table></div>}</section>
  </div><AttendanceCorrectionModal open={correctionOpen} onClose={() => setCorrectionOpen(false)} onSubmit={(reason) => submitCorrection.mutate(reason)} /><PageChatbotWidget page="attendance" role="Employee" contextSummary={`${summary.late} late days, ${summary.absent} absences, ${summary.totalHours.toFixed(1)} total hours.`} quickPrompts={["How many times was I late?", "How do I correct a missing clock in?", "What are my total hours?"]} /></div>;
}
