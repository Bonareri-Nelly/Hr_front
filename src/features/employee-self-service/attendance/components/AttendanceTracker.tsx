import { AlertCircle, CalendarClock, CheckCircle, Download, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import PageChatbotWidget from "../../../../components/shared/PageChatbotWidget";
import { executiveTheme } from "../../../../theme/executiveTheme";
import AttendanceCorrectionModal from "./AttendanceCorrectionModal";
import ClockInOutWidget from "./ClockInOutWidget";

type AttendanceRecord = { id: string; employeeId: string; date: string; clockIn: string | null; clockOut: string | null; hoursWorked: number; status: "present" | "late" | "absent" | "on_leave"; correctionRequested: boolean };

const initialRecords: AttendanceRecord[] = [
  { id: "ATT-1", employeeId: "EMP-1042", date: "2026-07-01", clockIn: "2026-07-01T07:58:00", clockOut: "2026-07-01T17:05:00", hoursWorked: 9.1, status: "present", correctionRequested: false },
  { id: "ATT-2", employeeId: "EMP-1042", date: "2026-07-02", clockIn: "2026-07-02T08:21:00", clockOut: "2026-07-02T17:00:00", hoursWorked: 8.6, status: "late", correctionRequested: false },
  { id: "ATT-3", employeeId: "EMP-1042", date: "2026-07-03", clockIn: null, clockOut: null, hoursWorked: 0, status: "absent", correctionRequested: false },
  { id: "ATT-4", employeeId: "EMP-1042", date: "2026-07-04", clockIn: null, clockOut: null, hoursWorked: 0, status: "on_leave", correctionRequested: false },
];

const labels = { present: "Present", late: "Late", absent: "Absent", on_leave: "On Leave" };

export default function AttendanceTracker() {
  const [records, setRecords] = useState(initialRecords);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [notice, setNotice] = useState("");
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [lastClockIn, setLastClockIn] = useState<string | null>(null);

  const visibleRecords = records.filter((record) => statusFilter === "all" || record.status === statusFilter);
  const summary = useMemo(() => ({ totalHours: records.reduce((sum, record) => sum + record.hoursWorked, 0), late: records.filter((record) => record.status === "late").length, absent: records.filter((record) => record.status === "absent").length }), [records]);

  const clockIn = () => {
    const now = new Date();
    setIsClockedIn(true);
    setLastClockIn(now.toISOString());
    setNotice(`Clock in captured server-side at ${now.toLocaleTimeString()}.`);
  };

  const clockOut = () => {
    const now = new Date();
    const clockInTime = lastClockIn ?? now.toISOString();
    const hours = Math.max(0.25, (now.getTime() - new Date(clockInTime).getTime()) / 3600000);
    setRecords((current) => [{ id: `ATT-${current.length + 1}`, employeeId: "EMP-1042", date: now.toISOString().slice(0, 10), clockIn: clockInTime, clockOut: now.toISOString(), hoursWorked: Number(hours.toFixed(2)), status: "present", correctionRequested: false }, ...current]);
    setIsClockedIn(false);
    setNotice(`Clock out captured server-side at ${now.toLocaleTimeString()}.`);
  };

  const requestCorrection = (message: string) => {
    setRecords((current) => current.map((record, index) => index === 0 ? { ...record, correctionRequested: true } : record));
    setNotice(`Correction routed to Branch HR Admin: ${message}`);
  };

  return (
    <div className={executiveTheme.page}>
      <div className={executiveTheme.shell}>
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className={executiveTheme.eyebrow}>Employee self-service</p><h1 className={executiveTheme.title}>Attendance Management</h1><p className={executiveTheme.subtitle}>Clock in/out, review your history, and request corrections through HR Admin approval.</p></div><button className={executiveTheme.buttonSecondary} onClick={() => setNotice("Attendance CSV export prepared.")}><Download size={16} /> Export</button></header>
        {notice && <div className="rounded-2xl border border-[#c8a45d]/30 bg-[#c8a45d]/10 p-4 text-sm text-[#f1d99b]">{notice}</div>}
        <div className="grid gap-4 lg:grid-cols-4"><ClockInOutWidget isClockedIn={isClockedIn} currentTime={new Date().toLocaleString()} onClockIn={clockIn} onClockOut={clockOut} /><div className={`${executiveTheme.cardSoft} p-5`}><p className={executiveTheme.eyebrow}>Total hours</p><strong className="text-3xl text-[#c8a45d]">{summary.totalHours.toFixed(1)}</strong></div><div className={`${executiveTheme.cardSoft} p-5`}><p className={executiveTheme.eyebrow}>Late count</p><strong className="text-3xl">{summary.late}</strong></div><div className={`${executiveTheme.cardSoft} p-5`}><p className={executiveTheme.eyebrow}>Absences</p><strong className="text-3xl">{summary.absent}</strong></div></div>
        <section className={`${executiveTheme.card} overflow-hidden`}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5"><h2 className="text-xl font-bold">Attendance history</h2><div className="flex items-center gap-2"><Filter size={16} className="text-[#c8a45d]" /><select className={executiveTheme.input} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All</option><option value="present">Present</option><option value="late">Late</option><option value="absent">Absent</option><option value="on_leave">On Leave</option></select><button className={executiveTheme.buttonPrimary} onClick={() => setCorrectionOpen(true)}><AlertCircle size={16} /> Request correction</button></div></div>{visibleRecords.length === 0 ? <div className="p-10 text-center text-[#c9d3df]">No attendance records yet</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-widest text-[#8fa0b8]"><tr><th className="p-4">Date</th><th>Clock in</th><th>Clock out</th><th>Hours</th><th>Status</th><th>Correction</th></tr></thead><tbody>{visibleRecords.map((record) => <tr key={record.id} className="border-t border-white/5"><td className="p-4">{record.date}</td><td>{record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : "-"}</td><td>{record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : "-"}</td><td>{record.hoursWorked}</td><td><span className={executiveTheme.badge}>{labels[record.status]}</span></td><td>{record.correctionRequested ? <span className="text-[#c8a45d]"><CheckCircle size={14} className="inline" /> Requested</span> : "-"}</td></tr>)}</tbody></table></div>}</section>
      </div>
      <AttendanceCorrectionModal open={correctionOpen} onClose={() => setCorrectionOpen(false)} onSubmit={requestCorrection} />
      <PageChatbotWidget page="attendance" role="Employee" contextSummary={`${summary.late} late days, ${summary.absent} absences, ${summary.totalHours.toFixed(1)} total hours this month.`} quickPrompts={["How many times was I late this month?", "How do I correct a missing clock in?", "What are my total hours?"]} />
    </div>
  );
}
