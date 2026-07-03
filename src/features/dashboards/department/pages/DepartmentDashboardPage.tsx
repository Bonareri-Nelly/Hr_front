import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  Plus,
  Route,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type Tone = "success" | "warning" | "danger" | "info";

const metrics: Array<{ label: string; value: string; meta: string; tone: Tone }> = [
  { label: "Department headcount", value: "214", meta: "+8 net movement", tone: "success" },
  { label: "Attendance today", value: "96.4%", meta: "7 exceptions", tone: "warning" },
  { label: "Payroll readiness", value: "91%", meta: "12 records pending", tone: "info" },
  { label: "Open actions", value: "18", meta: "5 due today", tone: "danger" },
];

const departmentRows: Array<[string, string, string, string, string, Tone, string]> = [
  ["People Operations", "Grace Wanjiru", "42", "97%", "Ready", "success", "/employees/lifecycle"],
  ["Talent Acquisition", "Brian Otieno", "28", "94%", "Hiring", "info", "/employees/onboarding"],
  ["Payroll Services", "Mercy Achieng", "36", "92%", "Review", "warning", "/payroll/approval"],
  ["Employee Relations", "Sam Mwangi", "31", "89%", "Attention", "danger", "/disciplinary/cases"],
  ["Learning & Development", "Amina Hassan", "24", "98%", "Ready", "success", "/training/announcements"],
];

const actionItems: Array<{ title: string; owner: string; due: string; tone: Tone; path: string; action: string }> = [
  { title: "Approve 6 pending contract renewals", owner: "Employee Lifecycle", due: "Today", tone: "danger", path: "/contracts", action: "Review contracts" },
  { title: "Resolve payroll bank mismatches", owner: "Payroll Services", due: "Today", tone: "warning", path: "/payroll/bank-integration", action: "Fix payroll" },
  { title: "Confirm July training attendance", owner: "Learning & Development", due: "Tomorrow", tone: "info", path: "/training/announcements", action: "Confirm training" },
  { title: "Close open grievance notes", owner: "Employee Relations", due: "Friday", tone: "warning", path: "/disciplinary/cases", action: "Close notes" },
];

const riskSignals: Array<{ label: string; value: string; percent: number; tone: Tone; path: string; action: string }> = [
  { label: "Contract files verified", value: "188 / 214", percent: 88, tone: "success", path: "/contracts", action: "Open files" },
  { label: "Leave balances reconciled", value: "199 / 214", percent: 93, tone: "success", path: "/leave/workflow", action: "Reconcile leave" },
  { label: "Missing tax PINs", value: "9 employees", percent: 38, tone: "warning", path: "/payroll/tax-compliance", action: "Fix tax data" },
  { label: "Disciplinary cases overdue", value: "3 cases", percent: 24, tone: "danger", path: "/disciplinary/cases", action: "Escalate cases" },
];

const staffingMix = [
  ["Permanent", "156", "73%"],
  ["Contract", "38", "18%"],
  ["Probation", "14", "7%"],
  ["Interns", "6", "2%"],
];

const approvalQueue: Array<{ title: string; owner: string; value: string; tone: Tone; path: string }> = [
  { title: "Overtime exception", owner: "Payroll Services", value: "KES 410K", tone: "danger", path: "/payroll/approval" },
  { title: "Contract renewal batch", owner: "People Operations", value: "6 contracts", tone: "warning", path: "/contracts" },
  { title: "Leave cover plan", owner: "Employee Relations", value: "4 teams", tone: "info", path: "/leave/approvals" },
];

const deadlineItems: Array<{ label: string; due: string; owner: string; path: string; tone: Tone }> = [
  { label: "Payroll record cleanup", due: "Today 4:00 PM", owner: "Payroll Services", path: "/payroll/creation", tone: "danger" },
  { label: "Attendance exception sign-off", due: "Today 5:00 PM", owner: "Operations leads", path: "/attendance", tone: "warning" },
  { label: "Training attendance confirmation", due: "Tomorrow", owner: "Learning & Development", path: "/training/announcements", tone: "info" },
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

export default function DepartmentDashboardPage() {
  const [feedback, setFeedback] = useState("");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

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
          <button className="button button-secondary" type="button" onClick={() => setFeedback("Department report export has been queued.")}>
            <Download aria-hidden="true" size={15} />
            Export
          </button>
          <button className="button button-primary" type="button" onClick={() => setIsActionModalOpen(true)}>
            <Plus aria-hidden="true" size={15} />
            Add Action
          </button>
        </div>
      </div>

      {feedback ? <div className="note action-feedback">{feedback}</div> : null}

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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {departmentRows.map(([department, lead, headcount, attendance, status, tone, path]) => (
                  <tr key={department}>
                    <td>{department}</td>
                    <td>{lead}</td>
                    <td>{headcount}</td>
                    <td>{attendance}</td>
                    <td>
                      <span className={`pill pill-${tone}`}>{status}</span>
                    </td>
                    <td>
                      <Link className="panel-action" to={path}>Open</Link>
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
            <button className="panel-action" type="button" onClick={() => setIsActionModalOpen(true)}>Assign</button>
          </div>
          <div className="panel-body">
            <ul className="department-action-list">
              {actionItems.map((item) => (
                <li className="department-action-item" key={item.title}>
                  <span className={`department-action-icon department-action-icon-${item.tone}`}>
                    <ActionIcon tone={item.tone} />
                  </span>
                  <div>
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-meta">{item.owner}</div>
                  </div>
                  <span className={`pill pill-${item.tone}`}>{item.due}</span>
                  <Link className="panel-action department-inline-action" to={item.path}>{item.action}</Link>
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
            <Link className="panel-action" to="/payroll/tax-compliance">Review files</Link>
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
                  <Link className="panel-action" to={signal.path}>{signal.action}</Link>
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

      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Approval Queue</h3>
            <Link className="panel-action" to="/payroll/approval">Open approvals</Link>
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
                    <div className="activity-meta">{item.owner}</div>
                  </div>
                  <strong>{item.value}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Due Next</h3>
            <button className="panel-action" type="button" onClick={() => setIsActionModalOpen(true)}>Add deadline</button>
          </div>
          <div className="panel-body">
            <ul className="department-action-list">
              {deadlineItems.map((item) => (
                <li className="department-action-item" key={item.label}>
                  <span className={`department-action-icon department-action-icon-${item.tone}`}>
                    <Route aria-hidden="true" size={16} />
                  </span>
                  <div>
                    <div className="activity-title">{item.label}</div>
                    <div className="activity-meta">{item.owner}</div>
                  </div>
                  <span className={`pill pill-${item.tone}`}>{item.due}</span>
                  <Link className="panel-action department-inline-action" to={item.path}>Do now</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {isActionModalOpen ? (
        <div className="modal-backdrop" role="presentation">
          <form
            className="department-modal"
            aria-label="Add department action"
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
              <button className="panel-action" type="button" onClick={() => setIsActionModalOpen(false)}>Close</button>
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
                </select>
              </label>
              <label className="field-control">
                <span className="eyebrow">Priority</span>
                <select className="select-control" defaultValue="high">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>
              <label className="field-control">
                <span className="eyebrow">Due date</span>
                <input className="select-control" type="date" defaultValue="2026-07-03" />
              </label>
            </div>

            <div className="note department-note">
              <UserCheck aria-hidden="true" size={17} />
              <span>Assigned actions appear in Operational Actions and should link to the workflow where the work is completed.</span>
            </div>

            <div className="action-row payroll-modal-actions">
              <button className="button button-secondary" type="button" onClick={() => setIsActionModalOpen(false)}>Cancel</button>
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
