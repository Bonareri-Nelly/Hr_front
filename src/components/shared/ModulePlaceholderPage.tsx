import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Download,
  FileCheck2,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type ModulePlaceholderPageProps = {
  title: string;
};

type Tone = "success" | "warning" | "danger" | "info";

const routeHints: Record<string, string> = {
  payroll: "/payroll",
  leave: "/leave/approvals",
  attendance: "/attendance",
  disciplinary: "/disciplinary/cases",
  contract: "/contracts",
  onboarding: "/employees/onboarding",
  offboarding: "/employees/offboarding",
  employee: "/employees/lifecycle",
  finance: "/dashboard/finance",
  bank: "/finance/bank-integration",
  benefits: "/benefits",
  training: "/training/announcements",
  performance: "/performance",
  reports: "/reports-analytics",
  security: "/security-audit",
  announcements: "/training/announcements",
  documents: "/self-service/documents",
  complaints: "/complaints",
};

function getPrimaryRoute(title: string) {
  const key = Object.keys(routeHints).find((item) => title.toLowerCase().includes(item));
  return key ? routeHints[key] : "/dashboard/executive";
}

function getTone(index: number): Tone {
  return (["success", "warning", "info", "danger"] as Tone[])[index % 4];
}

export default function ModulePlaceholderPage({ title }: ModulePlaceholderPageProps) {
  const [feedback, setFeedback] = useState("");
  const [isActionOpen, setIsActionOpen] = useState(false);
  const primaryRoute = getPrimaryRoute(title);
  const moduleName = title.replace(/\s*\(Accounts\)\s*/i, "");

  const metrics = useMemo(
    () => [
      { label: "Open items", value: "18", meta: "5 due today", tone: "danger" as Tone },
      { label: "Ready", value: "82%", meta: "Operational coverage", tone: "success" as Tone },
      { label: "Pending review", value: "7", meta: "Manager action", tone: "warning" as Tone },
      { label: "Updated", value: "Today", meta: "Live workspace", tone: "info" as Tone },
    ],
    [],
  );

  const actionItems = useMemo(
    () => [
      { title: `Review ${moduleName.toLowerCase()} exceptions`, owner: "Department Lead", due: "Today", tone: "danger" as Tone, path: primaryRoute },
      { title: `Assign pending ${moduleName.toLowerCase()} tasks`, owner: "Operations", due: "Today", tone: "warning" as Tone, path: primaryRoute },
      { title: `Prepare ${moduleName.toLowerCase()} update pack`, owner: "HR Admin", due: "Tomorrow", tone: "info" as Tone, path: "/reports-analytics" },
    ],
    [moduleName, primaryRoute],
  );

  const records = useMemo(
    () => [
      [`${moduleName} review`, "Operations", "12", "Today", "Attention"],
      [`${moduleName} approval`, "Manager", "7", "Tomorrow", "Pending"],
      [`${moduleName} audit`, "Compliance", "3", "Friday", "Ready"],
    ],
    [moduleName],
  );

  return (
    <div className="dashboard-page module-workspace">
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Operational workspace</div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">
            Manage key records, assign work, review exceptions, and open the connected workflow for this module.
          </p>
        </div>

        <div className="action-row">
          <button className="button button-secondary" type="button" onClick={() => setFeedback(`${title} export has been queued.`)}>
            <Download aria-hidden="true" size={15} />
            Export
          </button>
          <button className="button button-primary" type="button" onClick={() => setIsActionOpen(true)}>
            <Plus aria-hidden="true" size={15} />
            New Action
          </button>
        </div>
      </div>

      {feedback ? <div className="note action-feedback">{feedback}</div> : null}

      <section className="metrics" aria-label={`${title} summary metrics`}>
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

      <section className="module-focus-band" aria-label={`${title} focus`}>
        <div className="module-focus-copy">
          <span className="module-focus-icon">
            <Sparkles aria-hidden="true" size={20} />
          </span>
          <div>
            <div className="eyebrow">What needs attention</div>
            <h2>{moduleName} needs owner assignment and exception review before the next reporting cycle.</h2>
            <p>Use the action queue below to route work to the correct module and keep approvals moving.</p>
          </div>
        </div>
        <Link className="button button-primary" to={primaryRoute}>
          Open Workflow
          <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </section>

      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Action Queue</h3>
            <button className="panel-action" type="button" onClick={() => setIsActionOpen(true)}>Assign</button>
          </div>
          <div className="panel-body">
            <ul className="module-action-list">
              {actionItems.map((item) => (
                <li className="module-action-item" key={item.title}>
                  <span className={`module-action-icon module-action-icon-${item.tone}`}>
                    {item.tone === "danger" ? <AlertTriangle aria-hidden="true" size={16} /> : <CalendarClock aria-hidden="true" size={16} />}
                  </span>
                  <div>
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-meta">{item.owner}</div>
                  </div>
                  <span className={`pill pill-${item.tone}`}>{item.due}</span>
                  <Link className="panel-action module-inline-action" to={item.path}>Do now</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Readiness Checks</h3>
            <Link className="panel-action" to="/reports-analytics">Report</Link>
          </div>
          <div className="panel-body">
            <ul className="run-list">
              {["Data verified", "Approvals routed", "Evidence attached", "Audit ready"].map((label, index) => (
                <li className="run-item" key={label}>
                  <div className="department-progress-row">
                    <div>
                      <div className="run-title">{label}</div>
                      <div className="run-meta">{index === 3 ? "Needs review" : "In progress"}</div>
                    </div>
                    <span className={`pill pill-${getTone(index)}`}>{index === 3 ? "64%" : `${92 - index * 8}%`}</span>
                  </div>
                  <div className="progress" aria-label={`${label} progress`}>
                    <span style={{ width: index === 3 ? "64%" : `${92 - index * 8}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Recent Records</h3>
          <Link className="panel-action" to={primaryRoute}>Open all</Link>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Owner</th>
                <th>Items</th>
                <th>Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map(([record, owner, items, due, status], index) => (
                <tr key={record}>
                  <td>{record}</td>
                  <td>{owner}</td>
                  <td>{items}</td>
                  <td>{due}</td>
                  <td>
                    <span className={`pill pill-${getTone(index + 1)}`}>{status}</span>
                  </td>
                  <td>
                    <Link className="panel-action" to={primaryRoute}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Control Notes</h3>
          <button className="panel-action" type="button" onClick={() => setFeedback(`${title} control note has been saved.`)}>Save note</button>
        </div>
        <div className="panel-body module-note-grid">
          <div className="note module-note">
            <FileCheck2 aria-hidden="true" size={17} />
            <span>Keep documents, comments, and approval evidence attached to each record.</span>
          </div>
          <div className="note module-note">
            <ShieldCheck aria-hidden="true" size={17} />
            <span>Escalate overdue items before payroll, compliance, or executive reporting closes.</span>
          </div>
          <div className="note module-note">
            <CheckCircle2 aria-hidden="true" size={17} />
            <span>Use the workflow links to complete work in the correct connected module.</span>
          </div>
        </div>
      </section>

      {isActionOpen ? (
        <div className="modal-backdrop" role="presentation">
          <form
            className="module-modal"
            aria-label={`Create ${title} action`}
            onSubmit={(event) => {
              event.preventDefault();
              setFeedback(`${title} action has been created and assigned.`);
              setIsActionOpen(false);
            }}
          >
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Create action</div>
                <h2>New {moduleName} Action</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => setIsActionOpen(false)}>Close</button>
            </div>

            <div className="payroll-modal-grid">
              <label className="field-control">
                <span className="eyebrow">Action title</span>
                <input className="select-control" defaultValue={`Review ${moduleName.toLowerCase()} exceptions`} />
              </label>
              <label className="field-control">
                <span className="eyebrow">Owner</span>
                <select className="select-control" defaultValue="department-lead">
                  <option value="department-lead">Department Lead</option>
                  <option value="hr-admin">HR Admin</option>
                  <option value="finance">Finance</option>
                  <option value="compliance">Compliance</option>
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
                <input className="select-control" type="date" defaultValue="2026-07-07" />
              </label>
            </div>

            <div className="action-row payroll-modal-actions">
              <button className="button button-secondary" type="button" onClick={() => setIsActionOpen(false)}>Cancel</button>
              <button className="button button-primary" type="submit">
                <Plus aria-hidden="true" size={15} />
                Create Action
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

