import { Download, MessageCircle, Plus, Send, X } from "lucide-react";
import { useState } from "react";

const metrics = [
  { label: "Active employees", value: "1,248", meta: "+32 joined this month", tone: "success" },
  { label: "Payroll value", value: "KES 84.6M", meta: "July draft payroll", tone: "info" },
  { label: "Pending approvals", value: "17", meta: "3 require today", tone: "warning" },
  { label: "Compliance score", value: "98.2%", meta: "All statutory files ready", tone: "success" },
];

const payrollRows = [
  ["Nairobi HQ", "684", "KES 48.2M", "Ready", "success"],
  ["Mombasa", "214", "KES 13.7M", "Review", "warning"],
  ["Kisumu", "176", "KES 9.4M", "Ready", "success"],
  ["Remote Units", "174", "KES 13.3M", "Blocked", "danger"],
];

const activities = [
  ["Leave sync completed", "1,184 records refreshed from attendance"],
  ["PAYE schedule generated", "Statutory report queued for review"],
  ["New branch policy applied", "Housing allowance rule updated"],
];

const runs = [
  ["Gross payroll validation", "86"],
  ["Statutory deductions", "72"],
  ["Payslip publishing", "41"],
];

export default function Dashboard() {
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Payroll command center</div>
          <h1 className="page-title">Nexus HR &amp; Payroll</h1>
          <p className="page-subtitle">
            Monitor workforce movement, payroll readiness, statutory risk, and branch activity from one operational view.
          </p>
        </div>

        <div className="action-row">
          <button className="button button-secondary" type="button">
            <Download aria-hidden="true" size={15} />
            Export
          </button>
          <button className="button button-primary" type="button">
            <Plus aria-hidden="true" size={15} />
            New Run
          </button>
        </div>
      </div>

      <section className="metrics" aria-label="Payroll summary metrics">
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

      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Branch Payroll Readiness</h3>
            <button className="panel-action" type="button">View all</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Employees</th>
                  <th>Payroll</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payrollRows.map(([branch, employees, payroll, status, tone]) => (
                  <tr key={branch}>
                    <td>{branch}</td>
                    <td>{employees}</td>
                    <td>{payroll}</td>
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
            <h3 className="panel-title">Current Run</h3>
            <button className="panel-action" type="button">Open</button>
          </div>
          <div className="panel-body">
            <ul className="run-list">
              {runs.map(([title, percent]) => (
                <li className="run-item" key={title}>
                  <div>
                    <div className="run-title">{title}</div>
                    <div className="run-meta">{percent}% complete</div>
                  </div>
                  <div className="progress" aria-label={`${title} progress`}>
                    <span style={{ width: `${percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Access Scope</h3>
            <button className="panel-action" type="button">Manage roles</button>
          </div>
          <div className="panel-body">
            <div className="note">
              Payroll Admin can execute branch payroll, approve deductions, publish payslips, and view compliance reports across all active units.
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Recent Activity</h3>
            <button className="panel-action" type="button">Audit log</button>
          </div>
          <div className="panel-body">
            <ul className="activity-list">
              {activities.map(([title, meta]) => (
                <li className="activity-item" key={title}>
                  <span className="activity-dot" />
                  <div>
                    <div className="activity-title">{title}</div>
                    <div className="activity-meta">{meta}</div>
                  </div>
                  <span className="pill pill-info">Now</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {chatOpen ? (
        <aside className="chat-panel" aria-label="Nexus assistant">
          <div className="chat-header">
            <div>
              <div className="chat-title">Nexus Assistant</div>
              <div className="activity-meta">Payroll context active</div>
            </div>
            <button className="icon-button" type="button" aria-label="Close chat" onClick={() => setChatOpen(false)}>
              <X aria-hidden="true" size={16} />
            </button>
          </div>
          <div className="chat-messages">
            <div className="chat-message bot">Mombasa has two unresolved deduction exceptions before payroll can close.</div>
            <div className="chat-message user">Draft a follow-up for the branch payroll officer.</div>
            <div className="chat-message bot">I can prepare a concise approval note with the affected employee IDs.</div>
          </div>
          <div className="chat-input">
            <input aria-label="Message Nexus assistant" placeholder="Ask about payroll, attendance, or approvals" />
            <button className="icon-button" type="button" aria-label="Send message">
              <Send aria-hidden="true" size={16} />
            </button>
          </div>
        </aside>
      ) : null}

      <button className="chat-fab" type="button" aria-label="Open assistant" onClick={() => setChatOpen((open) => !open)}>
        <MessageCircle aria-hidden="true" size={21} />
      </button>
    </div>
  );
}
