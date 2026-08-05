import { Calendar, ChevronRight, ClipboardList, FileText, HelpCircle, MessageSquare, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { resources, type ApiRecord } from "../../../../services/api/resources";
import PageChatbotWidget from "../../../../components/shared/PageChatbotWidget";

type CurrentUser = {
  id: number;
  username: string;
  email?: string;
  employee_id?: number;
  branch_name?: string;
  department_name?: string;
  role_name?: string;
};

const getCurrentUser = (): CurrentUser | null => {
  try {
    return JSON.parse(localStorage.getItem("current_user") ?? localStorage.getItem("user") ?? "{}");
  } catch {
    return null;
  }
};

const actionIcons: Record<string, typeof Calendar> = {
  "My Attendance": Calendar,
  "My Performance": TrendingUp,
  "My Payslips": FileText,
  "My Documents": ClipboardList,
  "My Announcements": MessageSquare,
  "Ask HR Bot": HelpCircle,
};

const actionPaths: Record<string, string> = {
  "My Attendance": "/self-service/attendance",
  "My Performance": "/self-service/performance",
  "My Payslips": "/self-service/payslips",
  "My Documents": "/self-service/documents",
  "My Announcements": "/self-service/announcements",
  "Ask HR Bot": "/self-service/announcements",
};

export default function EmployeeDashboardPage() {
  const user = getCurrentUser();
  const employeeId = user?.employee_id;

  const profile = useQuery({
    queryKey: ["employee-profile", employeeId],
    queryFn: () => resources.employees.list(),
    enabled: Boolean(employeeId),
    select: (data: ApiRecord[]) => data.find((e: ApiRecord) => Number(e.id) === employeeId),
  });

  const leaveBalances = useQuery({
    queryKey: ["leave-balances"],
    queryFn: () => resources.leaveBalances.list(),
  });

  const payslips = useQuery({
    queryKey: ["payslips"],
    queryFn: () => resources.payslips.list(),
  });

  const announcements = useQuery({
    queryKey: ["announcements"],
    queryFn: () => resources.announcements.list(),
  });

  const complaints = useQuery({
    queryKey: ["complaints"],
    queryFn: () => resources.complaints.list(),
  });

  const reviews = useQuery({
    queryKey: ["performance-reviews"],
    queryFn: () => resources.hrPerformanceReviews.list(),
  });

  const records = useQuery({
    queryKey: ["attendance-records"],
    queryFn: () => resources.attendanceRecords.list(),
  });

  const profData = profile.data as ApiRecord | undefined;
  const leaves = (leaveBalances.data ?? []) as ApiRecord[];
  const payslipList = (payslips.data ?? []) as ApiRecord[];
  const announcementList = (announcements.data ?? []) as ApiRecord[];
  const complaintList = (complaints.data ?? []) as ApiRecord[];
  const reviewList = (reviews.data ?? []) as ApiRecord[];
  const attendanceList = (records.data ?? []) as ApiRecord[];

  const totalLeaveBalance = leaves.reduce((sum: number, l: ApiRecord) => sum + Number(l.days_remaining ?? l.balance ?? 0), 0);
  const pendingRequests = complaintList.filter((c: ApiRecord) => c.status === "pending" || c.status === "open").length;
  const nextPayslip = payslipList.length ? payslipList[0] : null;
  const attendanceRate = attendanceList.length ? ((attendanceList.filter((r: ApiRecord) => r.status === "Present" || r.status === "present").length / attendanceList.length) * 100).toFixed(1) : "—";
  const nextReview = reviewList.find((r: ApiRecord) => r.status !== "finalized" && r.status !== "approved");

  const employeeName = profData?.full_name ?? profData?.name ?? user?.username ?? "Employee";
  const branchName = user?.branch_name ?? profData?.branch ?? "—";
  const deptName = user?.department_name ?? profData?.department ?? "—";

  const actions = [
    { title: "My Attendance", description: "Clock in/out and view history" },
    { title: "My Performance", description: "Review goals and ratings" },
    { title: "My Payslips", description: nextPayslip ? `Latest payslip available` : "No payslips yet" },
    { title: "My Documents", description: "Access your HR documents" },
    { title: "My Announcements", description: `${announcementList.length} announcement${announcementList.length !== 1 ? "s" : ""}` },
    { title: "Ask HR Bot", description: "Leave, pay, policies" },
  ];

  const timelineEvents = [
    { date: profData?.hire_date ?? "—", title: "Hire Date", description: profData?.department ? `Joined ${profData.department}` : "Employment start" },
    { date: branchName, title: "Branch", description: profData?.branch ? `Assigned to ${profData.branch}` : "Branch assignment" },
    { date: deptName, title: "Department", description: `Department: ${deptName}` },
    ...(nextReview ? [{ date: nextReview.evaluation_period ?? "—", title: "Performance Review", description: `Status: ${nextReview.status ?? "pending"}` }] : []),
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="page-kicker">Employee self-service</p>
          <h1 className="page-title">Welcome back, {employeeName}</h1>
          <p className="page-subtitle">{branchName}, {deptName}</p>
        </div>
      </div>

      <div className="metrics">
        <div className="metric-cell">
          <p className="metric-label">Leave Balance</p>
          <p className="metric-value compact-metric">{totalLeaveBalance}</p>
          <p className="metric-meta">Available days</p>
        </div>
        <div className="metric-cell">
          <p className="metric-label">Attendance Rate</p>
          <p className="metric-value compact-metric">{attendanceRate}%</p>
          <p className="metric-meta">This period</p>
        </div>
        <div className="metric-cell">
          <p className="metric-label">Next Appraisal</p>
          <p className="metric-value compact-metric">{nextReview ? (nextReview.evaluation_period ?? "TBD") : "No review"}</p>
          <p className="metric-meta">{nextReview ? `Status: ${nextReview.status}` : "Awaiting cycle"}</p>
        </div>
        <div className="metric-cell">
          <p className="metric-label">Pending Requests</p>
          <p className="metric-value compact-metric">{pendingRequests}</p>
          <p className="metric-meta">Requires action</p>
        </div>
      </div>

      <div className="grid-2col" style={{ gridTemplateColumns: "2fr 1fr", gap: "20px", alignItems: "start" }}>
        <div className="grid-main">
          <section className="panel">
            <div className="panel-header">
              <h3 className="panel-title">Quick Actions</h3>
            </div>
            <div className="panel-body">
              <div className="alert-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                {actions.map((action) => {
                  const Icon = actionIcons[action.title] ?? ChevronRight;
                  const path = actionPaths[action.title] ?? "#";
                  return (
                    <Link key={action.title} to={path} className="note" style={{ textDecoration: "none", color: "inherit", cursor: "pointer", display: "block" }}>
                      <Icon size={20} style={{ color: "var(--navy-deepest)", marginBottom: "8px" }} />
                      <p className="alert-title" style={{ fontWeight: 800, fontSize: "0.82rem", color: "var(--ink)", margin: "0 0 4px" }}>{action.title}</p>
                      <p className="page-subtitle" style={{ fontSize: "0.72rem" }}>{action.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3 className="panel-title">My Timeline</h3>
            </div>
            <div className="panel-body">
              <div className="section-stack">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", alignItems: "start", padding: "10px 0", borderBottom: idx < timelineEvents.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                    <span className="eyebrow">{event.date}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)", margin: "0 0 2px" }}>{event.title}</p>
                      <p className="page-subtitle">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6" style={{ display: "grid", gap: "20px" }}>
          <section className="panel">
            <div className="panel-header">
              <h3 className="panel-title">Announcements</h3>
            </div>
            <div className="panel-body">
              {announcementList.length === 0 ? (
                <p className="page-subtitle">No announcements yet.</p>
              ) : (
                <div className="section-stack">
                  {announcementList.slice(0, 3).map((a: ApiRecord) => (
                    <div key={a.id} className="note">
                      <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "var(--ink)", margin: "0 0 2px" }}>{a.title ?? "Announcement"}</p>
                      <p className="page-subtitle">{(a.content ?? a.description ?? "").slice(0, 100)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3 className="panel-title">Profile</h3>
            </div>
            <div className="panel-body">
              <div className="section-stack">
                <div className="note"><p className="eyebrow">Employee ID</p><p className="compact-metric">{profData?.employee_code ?? profData?.code ?? "—"}</p></div>
                <div className="note"><p className="eyebrow">Position</p><p className="compact-metric">{profData?.position ?? profData?.role ?? "—"}</p></div>
                <div className="note"><p className="eyebrow">Email</p><p className="compact-metric">{user?.email ?? "—"}</p></div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <PageChatbotWidget page="employee-dashboard" role="Employee" contextSummary={`${announcementList.length} announcements, ${payslipList.length} payslips.`} quickPrompts={["How do I clock in?", "When is my next payslip?"]} />
    </div>
  );
}
