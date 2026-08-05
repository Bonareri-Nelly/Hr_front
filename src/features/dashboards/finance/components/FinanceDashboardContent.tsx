import { useFinanceDashboard } from "../hooks/useFinanceDashboard";
import { AlertTriangle, CheckCircle2, Download, FileCheck2, Landmark, RefreshCw, Send, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function FinanceDashboardContent() {
  const { data, isLoading } = useFinanceDashboard();

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="panel panel-body" style={{ textAlign: "center", padding: "48px" }}>
          <p className="page-subtitle">Loading finance metrics...</p>
        </div>
      </div>
    );
  }

  const { branchSummary, approvals, complianceItems, disbursements, budgetRows, trend } = data;

  const formatKes = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount);

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
            <Link className="button button-secondary" to="/dashboard/finance">
              <RefreshCw aria-hidden="true" size={15} />
              Refresh
            </Link>
            <Link className="button button-primary" to="/reports-analytics">
              <Download aria-hidden="true" size={15} />
              Export
            </Link>
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
          <Link className="button button-secondary" to="/payroll/approval">
            <FileCheck2 aria-hidden="true" size={15} />
            Review packet
          </Link>
          <Link className="button button-success" to="/payroll/history">
            <Send aria-hidden="true" size={15} />
            Release ready batch
          </Link>
        </div>
      </section>

      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Payroll Approval Queue</h3>
            <Link className="panel-action" to="/payroll/approval">Open payroll</Link>
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
                {approvals.map((approval: any) => (
                  <tr key={approval.id || approval[0]}>
                    <td>{approval.id || approval[0]}</td>
                    <td>{approval.branch || approval[1]}</td>
                    <td>{approval.period || approval[2]}</td>
                    <td>{approval.amount || approval[3]}</td>
                    <td>{approval.employees || approval[4]}</td>
                    <td>
                      <span className={`pill pill-${approval.tone || approval[6]}`}>{approval.status || approval[5]}</span>
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
            <Link className="panel-action" to="/payroll/approval">Assign</Link>
          </div>
          <div className="panel-body">
            <ul className="finance-alert-list">
              {disbursements.map((disbursement: any) => (
                <li className="finance-alert-item" key={disbursement.title || disbursement[0]}>
                  <span className={`finance-alert-icon finance-alert-icon-${disbursement.tone || disbursement[3]}`}>
                    {(disbursement.tone || disbursement[3]) === "success" ? (
                      <CheckCircle2 aria-hidden="true" size={16} />
                    ) : (
                      <AlertTriangle aria-hidden="true" size={16} />
                    )}
                  </span>
                  <div>
                    <div className="activity-title">{disbursement.title || disbursement[0]}</div>
                    <div className="activity-meta">{disbursement.detail || disbursement[1]}</div>
                  </div>
                  <span className={`pill pill-${disbursement.tone || disbursement[3]}`}>{disbursement.meta || disbursement[2]}</span>
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
            <Link className="panel-action" to="/finance/tax-compliance">View filings</Link>
          </div>
          <div className="panel-body">
            <ul className="run-list">
              {complianceItems.map((item: any) => (
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
            <Link className="panel-action" to="/payroll/history">Forecast</Link>
          </div>
          <div className="panel-body">
            <div className="mini-chart" aria-label="Payroll cost trend index">
              {trend.map((t: any) => (
                <div className="mini-bar" key={t.month || t[0]}>
                  <span style={{ height: `${(t.value || t[1]) - 18}%` }} />
                  <small>{t.month || t[0]}</small>
                  <em>{t.value || t[1]}</em>
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
          <Link className="panel-action" to="/reports-analytics">Open budget</Link>
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
              {budgetRows.map((row: any) => (
                <tr key={row.category || row[0]}>
                  <td>{row.category || row[0]}</td>
                  <td>{row.allocated || row[1]}</td>
                  <td>{row.spent || row[2]}</td>
                  <td>
                    <div className="finance-table-progress">
                      <div className="progress" aria-label={`${row.category || row[0]} budget utilization`}>
                        <span style={{ width: `${row.percent || row[3]}%` }} />
                      </div>
                      <span>{row.percent || row[3]}%</span>
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
