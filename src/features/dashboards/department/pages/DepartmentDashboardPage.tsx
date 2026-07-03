import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Download,
  FileCheck2,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

type Tone = "success" | "warning" | "danger" | "info";

const metrics: Array<{ label: string; value: string; meta: string; tone: Tone }> = [
  { label: "Department headcount", value: "214", meta: "+8 net movement", tone: "success" },
  { label: "Attendance today", value: "96.4%", meta: "7 exceptions", tone: "warning" },
  { label: "Payroll readiness", value: "91%", meta: "12 records pending", tone: "info" },
  { label: "Open actions", value: "18", meta: "5 due today", tone: "danger" },
];

const departmentRows: Array<[string, string, string, string, string, Tone]> = [
  ["People Operations", "Grace Wanjiru", "42", "97%", "Ready", "success"],
  ["Talent Acquisition", "Brian Otieno", "28", "94%", "Hiring", "info"],
  ["Payroll Services", "Mercy Achieng", "36", "92%", "Review", "warning"],
  ["Employee Relations", "Sam Mwangi", "31", "89%", "Attention", "danger"],
  ["Learning & Development", "Amina Hassan", "24", "98%", "Ready", "success"],
];

const actionItems: Array<{ title: string; owner: string; due: string; tone: Tone }> = [
  { title: "Approve 6 pending contract renewals", owner: "Employee Lifecycle", due: "Today", tone: "danger" },
  { title: "Resolve payroll bank mismatches", owner: "Payroll Services", due: "Today", tone: "warning" },
  { title: "Confirm July training attendance", owner: "Learning & Development", due: "Tomorrow", tone: "info" },
  { title: "Close open grievance notes", owner: "Employee Relations", due: "Friday", tone: "warning" },
];

const riskSignals: Array<{ label: string; value: string; percent: number; tone: Tone }> = [
  { label: "Contract files verified", value: "188 / 214", percent: 88, tone: "success" },
  { label: "Leave balances reconciled", value: "199 / 214", percent: 93, tone: "success" },
  { label: "Missing tax PINs", value: "9 employees", percent: 38, tone: "warning" },
  { label: "Disciplinary cases overdue", value: "3 cases", percent: 24, tone: "danger" },
];

const staffingMix = [
  ["Permanent", "156", "73%"],
  ["Contract", "38", "18%"],
  ["Probation", "14", "7%"],
  ["Interns", "6", "2%"],
];

export default function DepartmentDashboardPage() {
  return (
    <div className="dashboard-page department-dashboard">
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
          <Link className="button button-secondary" to="/reports-analytics">
            <Download aria-hidden="true" size={15} />
            Export
          </Link>
          <Link className="button button-primary" to="/employees/lifecycle">
            <Plus aria-hidden="true" size={15} />
            Add Action
          </Link>
        </div>
      </div>

      <section className="metrics" aria-label="Department summary metrics">
        {metrics.map((metric) => (
          <div className="metric-cell" key={metric.label}>
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-meta">
              <span className={`pill pill-${metric.tone}`}>{metric.meta}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="department-focus-band" aria-label="Current department focus">
        <div className="department-focus-copy">
          <span className="department-focus-icon">
            <Users aria-hidden="true" size={20} />
          </span>
          <div>
            <div className="eyebrow">Current focus</div>
            <h2>Payroll Services needs record cleanup before payroll approval.</h2>
            <p>
              Twelve employee records still need bank validation, tax PIN confirmation, or leave balance reconciliation.
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

      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Department Health</h3>
            <Link className="panel-action" to="/employees/lifecycle">Open departments</Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Lead</th>
                  <th>Headcount</th>
                  <th>Attendance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentRows.map(([department, lead, headcount, attendance, status, tone]) => (
                  <tr key={department}>
                    <td>{department}</td>
                    <td>{lead}</td>
                    <td>{headcount}</td>
                    <td>{attendance}</td>
                    <td>
                      <span className={`pill pill-${tone}`}>{status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Operational Actions</h3>
            <Link className="panel-action" to="/performance">Assign</Link>
          </div>
          <div className="panel-body">
            <ul className="department-action-list">
              {actionItems.map((item) => (
                <li className="department-action-item" key={item.title}>
                  <span className={`department-action-icon department-action-icon-${item.tone}`}>
                    {item.tone === "danger" ? (
                      <AlertTriangle aria-hidden="true" size={16} />
                    ) : item.tone === "success" ? (
                      <CheckCircle2 aria-hidden="true" size={16} />
                    ) : (
                      <CalendarClock aria-hidden="true" size={16} />
                    )}
                  </span>
                  <div>
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-meta">{item.owner}</div>
                  </div>
                  <span className={`pill pill-${item.tone}`}>{item.due}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Compliance & Readiness</h3>
            <Link className="panel-action" to="/contracts">Review files</Link>
          </div>
          <div className="panel-body">
            <ul className="run-list">
              {riskSignals.map((signal) => (
                <li className="run-item" key={signal.label}>
                  <div className="department-progress-row">
                    <div>
                      <div className="run-title">{signal.label}</div>
                      <div className="run-meta">{signal.value}</div>
                    </div>
                    <span className={`pill pill-${signal.tone}`}>{signal.percent}%</span>
                  </div>
                  <div className="progress" aria-label={`${signal.label} progress`}>
                    <span style={{ width: `${signal.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Staffing Mix</h3>
            <Link className="panel-action" to="/performance">Workforce plan</Link>
          </div>
          <div className="panel-body">
            <div className="department-staffing-grid">
              {staffingMix.map(([label, value, percent]) => (
                <div className="department-staffing-cell" key={label}>
                  <div className="metric-label">{label}</div>
                  <div className="metric-value">{value}</div>
                  <div className="metric-meta">{percent} of department staff</div>
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
    </div>
  );
}

