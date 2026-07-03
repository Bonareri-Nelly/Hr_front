import { AlertTriangle, CheckCircle2, Download, FileCheck2, Landmark, RefreshCw, Send, ShieldCheck } from "lucide-react";

type Tone = "success" | "warning" | "danger" | "info";

const branchSummary = {
  name: "Branch payroll",
  payrollCost: 2450000,
  employees: 135,
  readiness: 91,
  status: "info" as Tone,
};

const approvals = [
  ["PR-2026-071", "Operations", "July 2026", "KES 450K", "45", "Bank validation", "warning"],
  ["PR-2026-072", "Administration", "July 2026", "KES 580K", "58", "Ready", "success"],
  ["PR-2026-073", "Sales", "July 2026", "KES 320K", "32", "Tax review", "info"],
] as const;

const complianceItems = [
  { label: "PAYE filing", value: "Draft ready", percent: 67, tone: "warning" as Tone },
  { label: "NHIF reconciliation", value: "Complete", percent: 100, tone: "success" as Tone },
  { label: "NSSF remittance", value: "Pending review", percent: 82, tone: "info" as Tone },
  { label: "Bank file validation", value: "7 exceptions", percent: 74, tone: "danger" as Tone },
];

const disbursements = [
  ["Bank file generated", "Nairobi payroll batch", "Today 09:10", "success"],
  ["Approval pending", "Eldoret salary batch", "Due today", "warning"],
  ["Exception opened", "7 account-name mismatches", "Needs review", "danger"],
  ["Compliance packet", "July statutory report", "Draft ready", "info"],
] as const;

const budgetRows = [
  ["Salaries", "KES 18.0M", "KES 9.0M", 50],
  ["Benefits", "KES 5.0M", "KES 2.3M", 46],
  ["Training", "KES 3.0M", "KES 1.2M", 40],
  ["Recruitment", "KES 4.0M", "KES 2.0M", 50],
] as const;

const trend = [
  ["Feb", 88],
  ["Mar", 92],
  ["Apr", 96],
  ["May", 98],
  ["Jun", 100],
  ["Jul", 102],
] as const;

const formatKes = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);

export default function FinanceDashboard() {
  return (
    <div className="dashboard-page finance-dashboard">
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Finance operations workspace</div>
          <h1 className="page-title">Finance Dashboard</h1>
          <p className="page-subtitle">
            Review payroll approvals, statutory readiness, banking exceptions, budget utilization, and disbursement
            status before release.
          </p>
        </div>

        <div className="finance-toolbar">
          <div className="action-row">
            <button className="button button-secondary" type="button">
              <RefreshCw aria-hidden="true" size={15} />
              Refresh
            </button>
            <button className="button button-primary" type="button">
              <Download aria-hidden="true" size={15} />
              Export
            </button>
          </div>
        </div>
      </div>

      <section className="metrics" aria-label="Finance dashboard summary">
        <div className="metric-cell">
          <div className="metric-label">Payroll cost</div>
          <div className="metric-value">{formatKes(branchSummary.payrollCost)}</div>
          <div className="metric-meta">{branchSummary.name} scope</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Employees paid</div>
          <div className="metric-value">{branchSummary.employees}</div>
          <div className="metric-meta">Included in current batch</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Readiness</div>
          <div className="metric-value">{branchSummary.readiness}%</div>
          <div className="metric-meta">
            <span className={`pill pill-${branchSummary.status}`}>Branch control status</span>
          </div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Open exceptions</div>
          <div className="metric-value">7</div>
          <div className="metric-meta">4 banking, 2 tax, 1 benefit</div>
        </div>
      </section>

      <section className="finance-release-band" aria-label="Current finance release status">
        <div className="finance-release-copy">
          <span className="finance-release-icon">
            <Landmark aria-hidden="true" size={20} />
          </span>
          <div>
            <div className="eyebrow">Release checkpoint</div>
            <h2>July payroll is blocked by bank validation and one tax review.</h2>
            <p>Finance can release the cleared batch after account-name cleanup and statutory packet signoff.</p>
          </div>
        </div>
        <div className="finance-release-actions">
          <button className="button button-secondary" type="button">
            <FileCheck2 aria-hidden="true" size={15} />
            Review packet
          </button>
          <button className="button button-success" type="button">
            <Send aria-hidden="true" size={15} />
            Release ready batch
          </button>
        </div>
      </section>

      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Payroll Approval Queue</h3>
            <button className="panel-action" type="button">Open payroll</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Cost center</th>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Employees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map(([batch, branch, period, amount, employees, status, tone]) => (
                  <tr key={batch}>
                    <td>{batch}</td>
                    <td>{branch}</td>
                    <td>{period}</td>
                    <td>{amount}</td>
                    <td>{employees}</td>
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
            <h3 className="panel-title">Alerts & Exceptions</h3>
            <button className="panel-action" type="button">Assign</button>
          </div>
          <div className="panel-body">
            <ul className="finance-alert-list">
              {disbursements.map(([title, detail, meta, tone]) => (
                <li className="finance-alert-item" key={title}>
                  <span className={`finance-alert-icon finance-alert-icon-${tone}`}>
                    {tone === "success" ? (
                      <CheckCircle2 aria-hidden="true" size={16} />
                    ) : (
                      <AlertTriangle aria-hidden="true" size={16} />
                    )}
                  </span>
                  <div>
                    <div className="activity-title">{title}</div>
                    <div className="activity-meta">{detail}</div>
                  </div>
                  <span className={`pill pill-${tone}`}>{meta}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Compliance Tracker</h3>
            <button className="panel-action" type="button">View filings</button>
          </div>
          <div className="panel-body">
            <ul className="run-list">
              {complianceItems.map((item) => (
                <li className="run-item" key={item.label}>
                  <div className="finance-progress-row">
                    <div>
                      <div className="run-title">{item.label}</div>
                      <div className="run-meta">{item.value}</div>
                    </div>
                    <span className={`pill pill-${item.tone}`}>{item.percent}%</span>
                  </div>
                  <div className="progress" aria-label={`${item.label} progress`}>
                    <span style={{ width: `${item.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Payroll Cost Trend</h3>
            <button className="panel-action" type="button">Forecast</button>
          </div>
          <div className="panel-body">
            <div className="mini-chart" aria-label="Payroll cost trend index">
              {trend.map(([month, value]) => (
                <div className="mini-bar" key={month}>
                  <span style={{ height: `${value - 18}%` }} />
                  <small>{month}</small>
                  <em>{value}</em>
                </div>
              ))}
            </div>
            <div className="note finance-note">
              <ShieldCheck aria-hidden="true" size={17} />
              <span>Projected July payroll is 3.4% over plan, driven by overtime and benefit renewals.</span>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Budget Management</h3>
          <button className="panel-action" type="button">Open budget</button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Allocated</th>
                <th>Spent</th>
                <th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {budgetRows.map(([category, allocated, spent, percent]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{allocated}</td>
                  <td>{spent}</td>
                  <td>
                    <div className="finance-table-progress">
                      <div className="progress" aria-label={`${category} budget utilization`}>
                        <span style={{ width: `${percent}%` }} />
                      </div>
                      <span>{percent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
