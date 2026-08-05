import { useState } from "react";
import { Shield, FileText, Search, Download, RefreshCw, Eye, X, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { resources } from "../../../../services/api/resources";
import { Link } from "react-router-dom";

type StatutoryRate = {
  id: number;
  name: string;
  rate?: number;
  employee_rate?: number;
  employer_rate?: number;
  description?: string;
  effective_date?: string;
  is_active?: boolean;
};

type TaxBand = {
  id: number;
  lower_limit?: number;
  upper_limit?: number;
  rate?: number;
  deduction?: number;
};

type PayrollRun = {
  id: number;
  name: string;
  period: string;
  status: string;
  total_amount?: number;
  employee_count?: number;
};

export default function TaxCompliancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRate, setSelectedRate] = useState<StatutoryRate | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const { data: statutoryRates = [], isLoading: ratesLoading, error: ratesError, refetch: refetchRates } = useQuery<StatutoryRate[]>({
    queryKey: ["statutory-rates"],
    queryFn: () => resources.statutoryRates.list() as Promise<StatutoryRate[]>,
  });

  const { data: taxBands = [], isLoading: bandsLoading } = useQuery<TaxBand[]>({
    queryKey: ["tax-bands"],
    queryFn: () => resources.taxBands.list() as Promise<TaxBand[]>,
  });

  const { data: payrollRuns = [] } = useQuery<PayrollRun[]>({
    queryKey: ["payroll-runs-tax"],
    queryFn: () => resources.payrollRuns.list() as Promise<PayrollRun[]>,
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRefresh = () => {
    refetchRates();
    showToast("Tax compliance data refreshed", "info");
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Employee Rate", "Employer Rate", "Effective Date", "Active"],
      ...filteredRates.map((r) => [
        r.name,
        r.employee_rate ?? r.rate ?? "—",
        r.employer_rate ?? "—",
        r.effective_date ?? "—",
        r.is_active ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tax-compliance.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Tax compliance data exported", "success");
  };

  const filteredRates = statutoryRates.filter((r) =>
    !searchTerm || r.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRates = statutoryRates.filter((r) => r.is_active !== false);
  const pendingRuns = payrollRuns.filter((r) => r.status === "Draft" || r.status === "Submitted" || r.status === "Pending");

  const isLoading = ratesLoading || bandsLoading;

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="panel">
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <p className="page-subtitle">Loading tax compliance data…</p>
          </div>
        </div>
      </div>
    );
  }

  if (ratesError) {
    return (
      <div className="dashboard-page">
        <div className="alert alert-error">
          Unable to load tax compliance data. Ensure the backend is running.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page payroll-workspace">
      {/* Header */}
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Statutory control</div>
          <h1 className="page-title">Tax &amp; Compliance</h1>
          <p className="page-subtitle">
            Track PAYE, pension, health, levy, audit flags, filing receipts, and statutory readiness before and after payroll release.
          </p>
        </div>
        <div className="finance-toolbar">
          <div className="action-row">
            <button className="button button-secondary" onClick={handleRefresh}>
              <RefreshCw aria-hidden="true" size={15} />
              Refresh
            </button>
            <button className="button button-secondary" onClick={handleExport}>
              <Download aria-hidden="true" size={15} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <section className="metrics" aria-label="Tax compliance summary">
        <div className="metric-cell">
          <div className="metric-label">Statutory Rates</div>
          <div className="metric-value">{statutoryRates.length}</div>
          <div className="metric-meta">Configured rates</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Active Rates</div>
          <div className="metric-value">{activeRates.length}</div>
          <div className="metric-meta"><span className="pill pill-success">Currently applied</span></div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Tax Bands</div>
          <div className="metric-value">{taxBands.length}</div>
          <div className="metric-meta">PAYE brackets</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Pending Payrolls</div>
          <div className="metric-value">{pendingRuns.length}</div>
          <div className="metric-meta"><span className={`pill pill-${pendingRuns.length > 0 ? "warning" : "success"}`}>
            {pendingRuns.length > 0 ? "Needs filing" : "All filed"}
          </span></div>
        </div>
      </section>

      {/* Compliance status band */}
      <section className="finance-release-band" aria-label="Compliance status">
        <div className="finance-release-copy">
          <span className="finance-release-icon">
            <Shield aria-hidden="true" size={20} />
          </span>
          <div>
            <div className="eyebrow">Compliance status</div>
            <h2>{activeRates.length > 0 ? "Statutory rates are configured and active." : "No active statutory rates found."}</h2>
            <p>
              {taxBands.length > 0
                ? `${taxBands.length} PAYE tax bands configured. Review rates before each payroll run.`
                : "Configure PAYE tax bands in the system settings before processing payroll."}
            </p>
          </div>
        </div>
        <div className="finance-release-actions">
          <Link className="button button-secondary" to="/payroll/approval">
            <FileText aria-hidden="true" size={15} />
            Review payroll
          </Link>
        </div>
      </section>

      <div className="grid-main">
        {/* Statutory Rates Table */}
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Statutory Rates</h3>
            <span className="eyebrow" style={{ color: "var(--text-muted)" }}>Read-only reference</span>
          </div>
          <div className="panel-body">
            <div className="payroll-table-controls">
              <div className="payroll-search-box">
                <Search aria-hidden="true" size={15} style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search rates…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="select-control"
                  style={{ border: "none", padding: "4px 8px", minWidth: "180px" }}
                />
              </div>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee Rate</th>
                  <th>Employer Rate</th>
                  <th>Effective Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Detail</th>
                </tr>
              </thead>
              <tbody>
                {filteredRates.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No statutory rates configured yet.
                    </td>
                  </tr>
                ) : (
                  filteredRates.map((rate) => (
                    <tr key={rate.id}>
                      <td style={{ fontWeight: 700 }}>{rate.name}</td>
                      <td>{rate.employee_rate != null ? `${Number(rate.employee_rate).toFixed(2)}%` : rate.rate != null ? `${Number(rate.rate).toFixed(2)}%` : "—"}</td>
                      <td>{rate.employer_rate != null ? `${Number(rate.employer_rate).toFixed(2)}%` : "—"}</td>
                      <td>{rate.effective_date ? new Date(rate.effective_date).toLocaleDateString("en-KE") : "—"}</td>
                      <td>
                        <span className={`pill pill-${rate.is_active !== false ? "success" : "danger"}`}>
                          {rate.is_active !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="button button-secondary button-sm"
                          onClick={() => { setSelectedRate(rate); setShowViewModal(true); }}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* PAYE Tax Bands */}
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">PAYE Tax Bands</h3>
          </div>
          <div className="panel-body">
            {taxBands.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px" }}>
                <p className="page-subtitle">No PAYE tax bands configured.</p>
              </div>
            ) : (
              <ul className="run-list">
                {taxBands.map((band) => (
                  <li className="run-item" key={band.id}>
                    <div className="payroll-progress-row">
                      <div>
                        <div className="run-title">
                          KES {Number(band.lower_limit ?? 0).toLocaleString()} – {band.upper_limit ? `KES ${Number(band.upper_limit).toLocaleString()}` : "Above"}
                        </div>
                        <div className="run-meta">Rate: {Number(band.rate ?? 0).toFixed(1)}%</div>
                      </div>
                      <span className="pill pill-info">{Number(band.rate ?? 0).toFixed(1)}%</span>
                    </div>
                    <div className="progress" aria-label={`Tax band ${band.id} rate`}>
                      <span style={{ width: `${Math.min(Number(band.rate ?? 0), 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Payroll Runs Compliance Status */}
      {payrollRuns.length > 0 && (
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Payroll Runs — Compliance Status</h3>
            <Link className="panel-action" to="/payroll/history">View all runs</Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Run Name</th>
                  <th>Period</th>
                  <th>Total Amount</th>
                  <th>Employees</th>
                  <th>Status</th>
                  <th>Compliance</th>
                </tr>
              </thead>
              <tbody>
                {payrollRuns.slice(0, 10).map((run) => (
                  <tr key={run.id}>
                    <td style={{ fontWeight: 700 }}>{run.name}</td>
                    <td>{run.period}</td>
                    <td>KES {Number(run.total_amount ?? 0).toLocaleString()}</td>
                    <td>{run.employee_count ?? "—"}</td>
                    <td>
                      <span className={`pill pill-${run.status === "Approved" || run.status === "Completed" ? "success" : run.status === "Rejected" ? "danger" : "warning"}`}>
                        {run.status}
                      </span>
                    </td>
                    <td>
                      {run.status === "Approved" || run.status === "Completed" ? (
                        <span className="pill pill-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle size={12} /> Filed
                        </span>
                      ) : (
                        <span className="pill pill-warning" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <AlertTriangle size={12} /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Audit note */}
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Compliance Notes</h3>
        </div>
        <div className="panel-body">
          <div className="note payroll-note">
            <ShieldCheck aria-hidden="true" size={17} />
            <span>All statutory deductions (PAYE, NHIF, NSSF, Housing Levy) are calculated automatically based on the configured rates above. Ensure rates are updated when KRA publishes new tax tables.</span>
          </div>
          <div className="payroll-control-grid">
            <div className="payroll-control-cell">
              <Shield aria-hidden="true" size={17} />
              <span>PAYE calculation</span>
              <strong>{taxBands.length > 0 ? "Ready" : "Not configured"}</strong>
            </div>
            <div className="payroll-control-cell">
              <FileText aria-hidden="true" size={17} />
              <span>Statutory rates</span>
              <strong>{activeRates.length > 0 ? `${activeRates.length} active` : "None"}</strong>
            </div>
            <div className="payroll-control-cell">
              <CheckCircle aria-hidden="true" size={17} />
              <span>Compliance status</span>
              <strong>{activeRates.length > 0 && taxBands.length > 0 ? "Compliant" : "Review needed"}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* View Rate Modal */}
      {showViewModal && selectedRate && (
        <div className="modal-backdrop" role="presentation">
          <div className="payroll-modal" aria-label="Statutory rate detail">
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Statutory rate</div>
                <h2>{selectedRate.name}</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="section-stack" style={{ marginTop: "16px" }}>
              <div className="note"><p className="eyebrow">Employee Rate</p><p className="compact-metric">{selectedRate.employee_rate != null ? `${Number(selectedRate.employee_rate).toFixed(2)}%` : selectedRate.rate != null ? `${Number(selectedRate.rate).toFixed(2)}%` : "—"}</p></div>
              <div className="note"><p className="eyebrow">Employer Rate</p><p className="compact-metric">{selectedRate.employer_rate != null ? `${Number(selectedRate.employer_rate).toFixed(2)}%` : "—"}</p></div>
              <div className="note"><p className="eyebrow">Effective Date</p><p className="compact-metric">{selectedRate.effective_date ? new Date(selectedRate.effective_date).toLocaleDateString("en-KE") : "—"}</p></div>
              <div className="note"><p className="eyebrow">Status</p><span className={`pill pill-${selectedRate.is_active !== false ? "success" : "danger"}`}>{selectedRate.is_active !== false ? "Active" : "Inactive"}</span></div>
              {selectedRate.description && <div className="note"><p className="eyebrow">Description</p><p className="compact-metric">{selectedRate.description}</p></div>}
            </div>
            <div className="action-row payroll-modal-actions">
              <button className="button button-secondary" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`payroll-toast payroll-toast-${toast.type}`} role="alert">
          {toast.message}
        </div>
      )}
    </div>
  );
}
