import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  FileCheck2,
  Filter,
  GraduationCap,
  LineChart,
  Megaphone,
  MessageSquare,
  PieChart,
  Plus,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type Tone = "success" | "warning" | "danger" | "info";

// Enhanced metrics with trends
const metrics: Array<{ 
  label: string; 
  value: string; 
  meta: string; 
  tone: Tone;
  trend?: "up" | "down";
  trendValue?: string;
}> = [
  { label: "Department headcount", value: "214", meta: "+8 net movement", tone: "success", trend: "up", trendValue: "3.8%" },
  { label: "Attendance today", value: "96.4%", meta: "7 exceptions", tone: "warning", trend: "up", trendValue: "1.2%" },
  { label: "Payroll readiness", value: "91%", meta: "12 records pending", tone: "info", trend: "down", trendValue: "4%" },
  { label: "Open actions", value: "18", meta: "5 due today", tone: "danger", trend: "down", trendValue: "2 tasks" },
];

const departmentRows: Array<{
  department: string;
  lead: string;
  headcount: string;
  attendance: string;
  payrollStatus: string;
  erCases: number;
  tone: Tone;
  path: string;
}> = [
  { department: "People Operations", lead: "Grace Wanjiru", headcount: "42", attendance: "97%", payrollStatus: "Ready", erCases: 0, tone: "success", path: "/employees/lifecycle" },
  { department: "Talent Acquisition", lead: "Brian Otieno", headcount: "28", attendance: "94%", payrollStatus: "Hiring", erCases: 1, tone: "info", path: "/employees/onboarding" },
  { department: "Payroll Services", lead: "Mercy Achieng", headcount: "36", attendance: "92%", payrollStatus: "Review", erCases: 2, tone: "warning", path: "/payroll/approval" },
  { department: "Employee Relations", lead: "Sam Mwangi", headcount: "31", attendance: "89%", payrollStatus: "Attention", erCases: 3, tone: "danger", path: "/disciplinary/cases" },
  { department: "Learning & Development", lead: "Amina Hassan", headcount: "24", attendance: "98%", payrollStatus: "Ready", erCases: 0, tone: "success", path: "/training/announcements" },
];

const actionItems: Array<{ 
  title: string; 
  owner: string; 
  due: string; 
  tone: Tone; 
  path: string; 
  action: string;
  priority: "high" | "medium" | "low";
}> = [
  { title: "Approve 6 pending contract renewals", owner: "Employee Lifecycle", due: "Today", tone: "danger", path: "/contracts", action: "Review contracts", priority: "high" },
  { title: "Resolve payroll bank mismatches", owner: "Payroll Services", due: "Today", tone: "warning", path: "/payroll/bank-integration", action: "Fix payroll", priority: "high" },
  { title: "Confirm July training attendance", owner: "Learning & Development", due: "Tomorrow", tone: "info", path: "/training/announcements", action: "Confirm training", priority: "medium" },
  { title: "Close open grievance notes", owner: "Employee Relations", due: "Friday", tone: "warning", path: "/disciplinary/cases", action: "Close notes", priority: "medium" },
];

const riskSignals: Array<{ 
  label: string; 
  value: string; 
  percent: number; 
  tone: Tone; 
  path: string; 
  action: string;
  lastUpdated: string;
}> = [
  { label: "Contract files verified", value: "188 / 214", percent: 88, tone: "success", path: "/contracts", action: "Open files", lastUpdated: "2h ago" },
  { label: "Leave balances reconciled", value: "199 / 214", percent: 93, tone: "success", path: "/leave/workflow", action: "Reconcile leave", lastUpdated: "1h ago" },
  { label: "Missing tax PINs", value: "9 employees", percent: 38, tone: "warning", path: "/payroll/tax-compliance", action: "Fix tax data", lastUpdated: "30m ago" },
  { label: "Disciplinary cases overdue", value: "3 cases", percent: 24, tone: "danger", path: "/disciplinary/cases", action: "Escalate cases", lastUpdated: "15m ago" },
];

const staffingMix = [
  { type: "Permanent", value: "156", percent: "73%", trend: "stable" },
  { type: "Contract", value: "38", percent: "18%", trend: "up" },
  { type: "Probation", value: "14", percent: "7%", trend: "stable" },
  { type: "Interns", value: "6", percent: "2%", trend: "down" },
];

// New: Budget Overview
const budgetOverview = {
  totalBudget: "KES 42M",
  spent: "KES 28.5M",
  remaining: "KES 13.5M",
  percentSpent: 68,
  categories: [
    { name: "Salaries", amount: "KES 22M", percent: 52 },
    { name: "Benefits", amount: "KES 8M", percent: 19 },
    { name: "Training", amount: "KES 5M", percent: 12 },
    { name: "Recruitment", amount: "KES 3.5M", percent: 8 },
    { name: "Operations", amount: "KES 3.5M", percent: 9 },
  ]
};

// New: Upcoming Events
const upcomingEvents = [
  { title: "Quarterly Review", date: "Jul 15, 2026", type: "meeting", attendees: 42 },
  { title: "Benefits Enrollment", date: "Jul 20, 2026", type: "deadline", attendees: 214 },
  { title: "Training Workshop", date: "Jul 25, 2026", type: "training", attendees: 28 },
];

// New: Recent Activities
const recentActivities = [
  { action: "Contract renewed", employee: "Jane Muthoni", time: "2h ago", department: "Engineering" },
  { action: "Leave approved", employee: "Peter Kimani", time: "3h ago", department: "Sales" },
  { action: "Payroll processed", employee: "Batch #124", time: "4h ago", department: "All" },
  { action: "Grievance filed", employee: "Anonymous", time: "5h ago", department: "Operations" },
];

// New: Turnover Metrics
const turnoverMetrics = {
  ytd: "4.2%",
  voluntary: "2.8%",
  involuntary: "1.4%",
  trend: "down" as const,
  highRiskDepartments: ["Employee Relations", "Talent Acquisition"]
};

const approvalQueue: Array<{ 
  title: string; 
  owner: string; 
  value: string; 
  tone: Tone; 
  path: string;
  submittedAt: string;
}> = [
  { title: "Overtime exception", owner: "Payroll Services", value: "KES 410K", tone: "danger", path: "/payroll/approval", submittedAt: "1h ago" },
  { title: "Contract renewal batch", owner: "People Operations", value: "6 contracts", tone: "warning", path: "/contracts", submittedAt: "3h ago" },
  { title: "Leave cover plan", owner: "Employee Relations", value: "4 teams", tone: "info", path: "/leave/approvals", submittedAt: "5h ago" },
];

const deadlineItems: Array<{ 
  label: string; 
  due: string; 
  owner: string; 
  path: string; 
  tone: Tone;
  type: string;
}> = [
  { label: "Payroll record cleanup", due: "Today 4:00 PM", owner: "Payroll Services", path: "/payroll/creation", tone: "danger", type: "compliance" },
  { label: "Attendance exception sign-off", due: "Today 5:00 PM", owner: "Operations leads", path: "/attendance", tone: "warning", type: "operations" },
  { label: "Training attendance confirmation", due: "Tomorrow", owner: "Learning & Development", path: "/training/announcements", tone: "info", type: "training" },
];

function ActionIcon({ tone }: { tone: Tone }) {
  if (tone === "danger") {
    return <AlertTriangle aria-hidden="true" size={16} />;
  }
  if (tone === "success") {
    return <CheckCircle2 aria-hidden="true" size={16} />;
  }
  if (tone === "info") {
    return <ClipboardCheck aria-hidden="true" size={16} />;
  }
  return <CalendarClock aria-hidden="true" size={16} />;
}

function TrendIcon({ trend }: { trend?: "up" | "down" }) {
  if (trend === "up") return <TrendingUp size={14} className="trend-up" />;
  if (trend === "down") return <TrendingDown size={14} className="trend-down" />;
  return null;
}

export default function DepartmentDashboardPage() {
  const [feedback, setFeedback] = useState("");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const handleExport = () => {
    setFeedback("Department report export has been queued. You'll receive an email when ready.");
  };

  const handleQuickAction = (action: string) => {
    setFeedback(`${action} has been initiated.`);
  };

  return (
    <div className="dashboard-page department-dashboard">
      {/* Header Section */}
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">HR operations workspace</div>
          <h1 className="page-title">Department Dashboard</h1>
          <p className="page-subtitle">
            Track departmental staffing, attendance exceptions, payroll readiness, employee relations risk,
            and the actions needed before the next approval cycle.
          </p>
        </div>

        <div className="action-row">
          <button className="button button-secondary" type="button" onClick={handleExport}>
            <Download aria-hidden="true" size={15} />
            Export
          </button>
          <button className="button button-secondary" type="button" onClick={() => handleQuickAction("Data refresh")}>
            <RefreshCw aria-hidden="true" size={15} />
            Refresh
          </button>
          <button className="button button-primary" type="button" onClick={() => setIsActionModalOpen(true)}>
            <Plus aria-hidden="true" size={15} />
            Add Action
          </Link>
        </div>
      </div>

      {feedback ? (
        <div className="note action-feedback">
          <CheckCircle2 size={16} />
          {feedback}
          <button onClick={() => setFeedback("")}>×</button>
        </div>
      ) : null}

      {/* Quick Stats Bar */}
      <div className="quick-stats-bar">
        <div className="stat-item">
          <Users size={16} />
          <div>
            <strong>214</strong>
            <span>Total Staff</span>
          </div>
        </div>
        <div className="stat-item">
          <Building2 size={16} />
          <div>
            <strong>5</strong>
            <span>Departments</span>
          </div>
        </div>
        <div className="stat-item">
          <Wallet size={16} />
          <div>
            <strong>KES 42M</strong>
            <span>Budget</span>
          </div>
        </div>
        <div className="stat-item">
          <Calendar size={16} />
          <div>
            <strong>3</strong>
            <span>Upcoming Events</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search departments, employees, or actions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="select-control"
        >
          <option value="all">All Departments</option>
          <option value="people-ops">People Operations</option>
          <option value="talent">Talent Acquisition</option>
          <option value="payroll">Payroll Services</option>
          <option value="er">Employee Relations</option>
          <option value="learning">Learning & Development</option>
        </select>
        <button className="button button-secondary">
          <Filter size={14} />
          More Filters
        </button>
      </div>

      {/* Key Metrics Section */}
      <section className="metrics" aria-label="Department summary metrics">
        {metrics.map((metric) => (
          <div className="metric-cell" key={metric.label}>
            <div className="metric-label">
              {metric.label}
              {metric.trend && <TrendIcon trend={metric.trend} />}
            </div>
            <div className="metric-value">
              {metric.value}
              {metric.trendValue && (
                <span className={`trend-value ${metric.trend}`}>
                  {metric.trendValue}
                </span>
              )}
            </div>
            <div className="metric-meta">
              <span className={`pill pill-${metric.tone}`}>{metric.meta}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Current Focus Band */}
      <section className="department-focus-band" aria-label="Current department focus">
        <div className="department-focus-copy">
          <span className="department-focus-icon">
            <Megaphone aria-hidden="true" size={20} />
          </span>
          <div>
            <div className="eyebrow">Current focus</div>
            <h2>Payroll Services needs record cleanup before payroll approval.</h2>
            <p>
              Twelve employee records still need bank validation, tax PIN confirmation, or leave balance reconciliation.
              Payroll processing deadline is Friday 5:00 PM.
            </p>
          </div>
        </div>
        <div className="department-focus-stats">
          <div>
            <strong>12</strong>
            <span>Pending records</span>
          </div>
          <div>
            <strong>5</strong>
            <span>Due today</span>
          </div>
          <div>
            <strong>91%</strong>
            <span>Ready</span>
          </div>
        </div>
      </section>

      {/* Department Health & Actions */}
      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Department Health</h3>
              <span className="panel-subtitle">Real-time department metrics</span>
            </div>
            <Link className="panel-action" to="/employees/lifecycle">
              View All
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Lead</th>
                  <th>Headcount</th>
                  <th>Attendance</th>
                  <th>Payroll</th>
                  <th>ER Cases</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {departmentRows.map((row) => (
                  <tr key={row.department}>
                    <td className="font-medium">{row.department}</td>
                    <td>{row.lead}</td>
                    <td>{row.headcount}</td>
                    <td>{row.attendance}</td>
                    <td>
                      <span className={`pill pill-${row.tone}`}>{row.payrollStatus}</span>
                    </td>
                    <td>
                      {row.erCases > 0 ? (
                        <span className="pill pill-danger">{row.erCases} open</span>
                      ) : (
                        <span className="pill pill-success">Clear</span>
                      )}
                    </td>
                    <td>
                      <Link className="panel-action" to={row.path}>
                        Details
                        <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Priority Actions</h3>
              <span className="panel-subtitle">Sorted by urgency</span>
            </div>
            <button className="panel-action" type="button" onClick={() => setIsActionModalOpen(true)}>
              <Plus size={14} />
              Assign
            </button>
          </div>
          <div className="panel-body">
            <ul className="department-action-list">
              {actionItems.map((item) => (
                <li className="department-action-item" key={item.title}>
                  <span className={`department-action-icon department-action-icon-${item.tone}`}>
                    <ActionIcon tone={item.tone} />
                  </span>
                  <div className="flex-1">
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-meta">
                      {item.owner} • <span className={`priority-${item.priority}`}>{item.priority} priority</span>
                    </div>
                  </div>
                  <span className={`pill pill-${item.tone}`}>{item.due}</span>
                  <Link className="button button-small button-primary" to={item.path}>
                    {item.action}
                    <ArrowUpRight size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Budget Overview - NEW */}
      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Budget Overview</h3>
              <span className="panel-subtitle">FY 2026 spending</span>
            </div>
            <Link className="panel-action" to="/budget">
              Full Report
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="panel-body">
            <div className="budget-header">
              <div>
                <div className="metric-label">Total Budget</div>
                <div className="metric-value">{budgetOverview.totalBudget}</div>
              </div>
              <div>
                <div className="metric-label">Spent</div>
                <div className="metric-value">{budgetOverview.spent}</div>
              </div>
              <div>
                <div className="metric-label">Remaining</div>
                <div className="metric-value">{budgetOverview.remaining}</div>
              </div>
            </div>
            <div className="progress budget-progress" aria-label="Budget utilization">
              <span style={{ width: `${budgetOverview.percentSpent}%` }} />
            </div>
            <div className="budget-categories">
              {budgetOverview.categories.map((cat) => (
                <div key={cat.name} className="budget-category-item">
                  <span>{cat.name}</span>
                  <span>{cat.amount}</span>
                  <span className="text-muted">{cat.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Turnover & Retention - NEW */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Turnover & Retention</h3>
              <span className="panel-subtitle">Year to date</span>
            </div>
            <Link className="panel-action" to="/analytics/turnover">
              Analytics
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="panel-body">
            <div className="turnover-metrics">
              <div className="turnover-main">
                <div className="metric-label">Overall Turnover</div>
                <div className="metric-value text-danger">{turnoverMetrics.ytd}</div>
                <TrendIcon trend="down" />
              </div>
              <div className="turnover-details">
                <div>
                  <span>Voluntary</span>
                  <strong>{turnoverMetrics.voluntary}</strong>
                </div>
                <div>
                  <span>Involuntary</span>
                  <strong>{turnoverMetrics.involuntary}</strong>
                </div>
              </div>
            </div>
            <div className="risk-departments">
              <div className="eyebrow">High Risk Departments</div>
              {turnoverMetrics.highRiskDepartments.map((dept) => (
                <div key={dept} className="risk-dept-item">
                  <AlertTriangle size={14} className="text-warning" />
                  <span>{dept}</span>
                  <UserMinus size={14} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Compliance & Staffing */}
      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Compliance & Readiness</h3>
              <span className="panel-subtitle">Real-time compliance tracking</span>
            </div>
            <Link className="panel-action" to="/payroll/tax-compliance">
              Review All
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="panel-body">
            <ul className="run-list">
              {riskSignals.map((signal) => (
                <li className="run-item" key={signal.label}>
                  <div className="department-progress-row">
                    <div>
                      <div className="run-title">{signal.label}</div>
                      <div className="run-meta">{signal.value} • Updated {signal.lastUpdated}</div>
                    </div>
                    <span className={`pill pill-${signal.tone}`}>{signal.percent}%</span>
                  </div>
                  <div className="progress" aria-label={`${signal.label} progress`}>
                    <span style={{ width: `${signal.percent}%` }} />
                  </div>
                  <Link className="panel-action" to={signal.path}>
                    {signal.action}
                    <ArrowUpRight size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Staffing Mix</h3>
              <span className="panel-subtitle">Employment type distribution</span>
            </div>
            <Link className="panel-action" to="/performance">
              Workforce Plan
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="panel-body">
            <div className="department-staffing-grid">
              {staffingMix.map((item) => (
                <div className="department-staffing-cell" key={item.type}>
                  <div className="metric-label">
                    {item.type}
                    <TrendIcon trend={item.trend as "up" | "down"} />
                  </div>
                  <div className="metric-value">{item.value}</div>
                  <div className="metric-meta">{item.percent} of department staff</div>
                </div>
              ))}
            </div>
            <div className="note department-note">
              <FileCheck2 aria-hidden="true" size={17} />
              <span>Next review should prioritize contract renewals, missing tax data, and attendance exceptions.</span>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Activity - NEW */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Recent Activity</h3>
            <span className="panel-subtitle">Latest HR transactions</span>
          </div>
          <button className="panel-action">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
        <div className="panel-body">
          <div className="activity-timeline">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <Clock size={14} />
                </div>
                <div className="activity-content">
                  <strong>{activity.action}</strong>
                  <span>{activity.employee}</span>
                  <span className="text-muted">{activity.department}</span>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approval Queue & Upcoming Events */}
      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Approval Queue</h3>
              <span className="panel-subtitle">Pending approvals requiring action</span>
            </div>
            <Link className="panel-action" to="/payroll/approval">
              Open Approvals
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="panel-body">
            <div className="department-task-grid">
              {approvalQueue.map((item) => (
                <Link className="department-task-card" to={item.path} key={item.title}>
                  <span className={`department-action-icon department-action-icon-${item.tone}`}>
                    <ShieldCheck aria-hidden="true" size={16} />
                  </span>
                  <div>
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-meta">{item.owner} • Submitted {item.submittedAt}</div>
                  </div>
                  <strong>{item.value}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Upcoming Events</h3>
              <span className="panel-subtitle">Next 30 days</span>
            </div>
            <button className="panel-action" type="button" onClick={() => setIsActionModalOpen(true)}>
              <Plus size={14} />
              Add Event
            </button>
          </div>
          <div className="panel-body">
            <ul className="department-action-list">
              {upcomingEvents.map((event) => (
                <li className="department-action-item" key={event.title}>
                  <span className="department-action-icon department-action-icon-info">
                    {event.type === "training" ? <GraduationCap size={16} /> :
                     event.type === "deadline" ? <Calendar size={16} /> :
                     <Users size={16} />}
                  </span>
                  <div className="flex-1">
                    <div className="activity-title">{event.title}</div>
                    <div className="activity-meta">{event.attendees} attendees</div>
                  </div>
                  <span className="pill pill-info">{event.date}</span>
                  <button className="panel-action">Details</button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Deadlines & Quick Actions */}
      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Critical Deadlines</h3>
              <span className="panel-subtitle">Next 48 hours</span>
            </div>
            <button className="panel-action" type="button" onClick={() => setIsActionModalOpen(true)}>
              Add Deadline
            </button>
          </div>
          <div className="panel-body">
            <ul className="department-action-list">
              {deadlineItems.map((item) => (
                <li className="department-action-item" key={item.label}>
                  <span className={`department-action-icon department-action-icon-${item.tone}`}>
                    <Route aria-hidden="true" size={16} />
                  </span>
                  <div className="flex-1">
                    <div className="activity-title">{item.label}</div>
                    <div className="activity-meta">{item.owner} • {item.type}</div>
                  </div>
                  <span className={`pill pill-${item.tone}`}>{item.due}</span>
                  <Link className="button button-small button-primary" to={item.path}>
                    Do now
                    <ArrowUpRight size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Quick Actions Panel - NEW */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Quick Actions</h3>
              <span className="panel-subtitle">Common tasks</span>
            </div>
          </div>
          <div className="panel-body">
            <div className="quick-actions-grid">
              <button className="quick-action-btn" onClick={() => handleQuickAction("New employee onboarding")}>
                <UserPlus size={20} />
                <span>Onboard Employee</span>
              </button>
              <button className="quick-action-btn" onClick={() => handleQuickAction("Leave approval")}>
                <CheckCircle2 size={20} />
                <span>Approve Leave</span>
              </button>
              <button className="quick-action-btn" onClick={() => handleQuickAction("Report generation")}>
                <BarChart3 size={20} />
                <span>Generate Report</span>
              </button>
              <button className="quick-action-btn" onClick={() => handleQuickAction("Meeting scheduling")}>
                <MessageSquare size={20} />
                <span>Schedule Meeting</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Action Modal */}
      {isActionModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsActionModalOpen(false)}>
          <form
            className="department-modal"
            aria-label="Add department action"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              setFeedback("Department action has been assigned and added to the queue.");
              setIsActionModalOpen(false);
            }}
          >
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Action assignment</div>
                <h2>Add Department Action</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => setIsActionModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="payroll-modal-grid">
              <label className="field-control">
                <span className="eyebrow">Action title</span>
                <input className="select-control" defaultValue="Resolve payroll readiness blockers" />
              </label>
              <label className="field-control">
                <span className="eyebrow">Owner</span>
                <select className="select-control" defaultValue="payroll">
                  <option value="payroll">Payroll Services</option>
                  <option value="employee-relations">Employee Relations</option>
                  <option value="people-ops">People Operations</option>
                  <option value="learning">Learning & Development</option>
                  <option value="talent">Talent Acquisition</option>
                </select>
              </label>
              <label className="field-control">
                <span className="eyebrow">Priority</span>
                <select className="select-control" defaultValue="high">
                  <option value="high">High - Immediate action required</option>
                  <option value="medium">Medium - This week</option>
                  <option value="low">Low - Next week</option>
                </select>
              </label>
              <label className="field-control">
                <span className="eyebrow">Due date</span>
                <input className="select-control" type="date" defaultValue="2026-07-03" />
              </label>
              <label className="field-control">
                <span className="eyebrow">Related department</span>
                <select className="select-control" defaultValue="all">
                  <option value="all">All Departments</option>
                  <option value="people-ops">People Operations</option>
                  <option value="payroll">Payroll Services</option>
                  <option value="er">Employee Relations</option>
                  <option value="learning">Learning & Development</option>
                </select>
              </label>
              <label className="field-control">
                <span className="eyebrow">Notify</span>
                <select className="select-control" defaultValue="email">
                  <option value="email">Email notification</option>
                  <option value="slack">Slack notification</option>
                  <option value="both">Both</option>
                </select>
              </label>
            </div>

            <div className="note department-note">
              <UserCheck aria-hidden="true" size={17} />
              <span>Assigned actions appear in Operational Actions and should link to the workflow where the work is completed.</span>
            </div>

            <div className="action-row payroll-modal-actions">
              <button className="button button-secondary" type="button" onClick={() => setIsActionModalOpen(false)}>
                Cancel
              </button>
              <button className="button button-primary" type="submit">
                <Plus aria-hidden="true" size={15} />
                Assign Action
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}