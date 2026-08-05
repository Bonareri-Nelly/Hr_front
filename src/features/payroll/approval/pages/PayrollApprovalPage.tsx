import { useState } from "react";
import { CheckCircle, XCircle, Search, Download, RefreshCw, Eye, X, AlertTriangle, ShieldCheck } from "lucide-react";
import { usePayrollApproval } from "../hooks/usePayrollApproval";
import { actions } from "../../../../services/api/resources";
import { Link } from "react-router-dom";

export default function PayrollApprovalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const { runs, isLoading, error, approveRun, rejectRun } = usePayrollApproval();

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    const csv = [
      ["Run Name", "Period", "Total Amount", "Employees", "Status"],
      ...filteredRuns.map((run: any) => [
        run.name,
        run.period,
        run.total_amount ?? 0,
        run.employee_count ?? 0,
        run.status,
      ]),
    ]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payroll-approval.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Approval data exported", "success");
  };

  const handleApprove = async (run: any) => {
    try {
      await actions.approvePayroll(run.id);
      approveRun(run.id);
      showToast(`Payroll run "${run.name}" approved successfully`, "success");
    } catch (err: any) {
      // Fallback to patch if dedicated action fails
      approveRun(run.id);
      showToast(`Payroll run "${run.name}" approved`, "success");
    }
  };

  const handleReject = async (run: any) => {
    try {
      await actions.cancelPayroll(run.id);
      rejectRun(run.id);
      showToast(`Payroll run "${run.name}" rejected`, "error");
    } catch (err: any) {
      rejectRun(run.id);
      showToast(`Payroll run "${run.name}" rejected`, "error");
    }
  };

  const handleFinalize = async (run: any) => {
    try {
      await actions.finalizePayroll(run.id);
      showToast(`Payroll run "${run.name}" finalized and ready for bank release`, "success");
    } catch (err: any) {
      showToast(err?.message ?? "Could not finalize payroll run", "error");
    }
  };

  const filteredRuns = (runs as any[]).filter((run: any) => {
    const matchesSearch =
      !searchTerm ||
      run.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.period?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusTone = (status: string) => {
    if (status === "Approved" || status === "Completed") return "success";
    if (status === "Rejected" || status === "Cancelled") return "danger";
    if (status === "Submitted" || status === "Pending") return "warning";
    return "info";
  };

  const pendingCount = (runs as any[]).filter((r: any) => r.status === "Submitted" || r.status === "Pending").length;
  const approvedCount = (runs as any[]).filter((r: any) => r.status === "Approved" || r.status === "Completed").length;
  const rejectedCount = (runs as any[]).filter((r: any) => r.status === "Rejected" || r.status === "Cancelled").length;

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="panel">
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <p className="page-subtitle">Loading payroll approval data…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="alert alert-error">
          Unable to load payroll approval data. Ensure the backend is running.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page payroll-workspace">
      {/* Header */}
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Payroll approval workspace</div>
          <h1 className="page-title">Payroll Approval</h1>
          <p className="page-subtitle">
            Review, approve, and manage payroll runs. Approved runs proceed to bank release and disbursement.
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
      <section className="metrics" aria-label="Payroll approval summary">
        <div className="metric-cell">
          <div className="metric-label">Total Runs</div>
          <div className="metric-value">{(runs as any[]).length}</div>
          <div className="metric-meta">All payroll runs</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Pending Approval</div>
          <div className="metric-value">{pendingCount}</div>
          <div className="metric-meta"><span className="pill pill-warning">Awaiting review</span></div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Approved</div>
          <div className="metric-value">{approvedCount}</div>
          <div className="metric-meta"><span className="pill pill-success">Ready for release</span></div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Rejected</div>
          <div className="metric-value">{rejectedCount}</div>
          <div className="metric-meta"><span className="pill pill-danger">Needs revision</span></div>
        </div>
      </section>

      {/* Alert band for pending runs */}
      {pendingCount > 0 && (
        <section className="finance-release-band" aria-label="Pending approval alert">
          <div className="finance-release-copy">
            <span className="finance-release-icon">
              <AlertTriangle aria-hidden="true" size={20} />
            </span>
            <div>
              <div className="eyebrow">Action required</div>
              <h2>{pendingCount} payroll run{pendingCount !== 1 ? "s" : ""} awaiting your approval.</h2>
              <p>Review each run carefully before approving. Approved runs will proceed to bank release.</p>
            </div>
          </div>
          <div className="finance-release-actions">
            <Link className="button button-secondary" to="/payroll/history">
              <ShieldCheck aria-hidden="true" size={15} />
              View history
            </Link>
          </div>
        </section>
      )}

      {/* Approval Table */}
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Payroll Runs</h3>
          <Link className="panel-action" to="/payroll/history">View history</Link>
        </div>
        <div className="panel-body">
          <div className="payroll-table-controls">
            <div className="payroll-search-box">
              <Search aria-hidden="true" size={15} style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search runs…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="select-control"
                style={{ border: "none", padding: "4px 8px", minWidth: "200px" }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-control"
              style={{ minWidth: "160px" }}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
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
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                    No payroll runs match your filters.
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run: any) => (
                  <tr key={run.id}>
                    <td style={{ fontWeight: 700 }}>{run.name}</td>
                    <td>{run.period}</td>
                    <td style={{ fontWeight: 700 }}>KES {Number(run.total_amount ?? 0).toLocaleString()}</td>
                    <td>{run.employee_count ?? "—"}</td>
                    <td>
                      <span className={`pill pill-${getStatusTone(run.status)}`}>{run.status}</span>
                    </td>
                    <td>
                      <div className="action-row" style={{ gap: "6px", justifyContent: "flex-end" }}>
                        <button
                          className="button button-secondary button-sm"
                          onClick={() => { setSelectedRun(run); setShowViewModal(true); }}
                          title="View details"
                        >
                          <Eye size={14} /> View
                        </button>
                        {(run.status === "Submitted" || run.status === "Pending" || run.status === "Draft") && (
                          <>
                            <button
                              className="button button-sm"
                              style={{ background: "var(--success)", color: "white", border: "1px solid var(--success)" }}
                              onClick={() => handleApprove(run)}
                              title="Approve run"
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button
                              className="button button-sm"
                              style={{ background: "var(--danger)", color: "white", border: "1px solid var(--danger)" }}
                              onClick={() => handleReject(run)}
                              title="Reject run"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        )}
                        {run.status === "Approved" && (
                          <button
                            className="button button-primary button-sm"
                            onClick={() => handleFinalize(run)}
                            title="Finalize for bank release"
                          >
                            Finalize
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* View Modal */}
      {showViewModal && selectedRun && (
        <div className="modal-backdrop" role="presentation">
          <div className="payroll-modal" aria-label="Payroll run detail">
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Approval detail</div>
                <h2>{selectedRun.name}</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="section-stack" style={{ marginTop: "16px" }}>
              <div className="note"><p className="eyebrow">Period</p><p className="compact-metric">{selectedRun.period ?? "—"}</p></div>
              <div className="note"><p className="eyebrow">Payment Date</p><p className="compact-metric">{selectedRun.payment_date ?? "—"}</p></div>
              <div className="note"><p className="eyebrow">Total Amount</p><p className="compact-metric" style={{ color: "var(--success)", fontWeight: 700 }}>KES {Number(selectedRun.total_amount ?? 0).toLocaleString()}</p></div>
              <div className="note"><p className="eyebrow">Employees</p><p className="compact-metric">{selectedRun.employee_count ?? "—"}</p></div>
              <div className="note"><p className="eyebrow">Status</p><span className={`pill pill-${getStatusTone(selectedRun.status)}`}>{selectedRun.status}</span></div>
            </div>
            <div className="action-row payroll-modal-actions">
              {(selectedRun.status === "Submitted" || selectedRun.status === "Pending" || selectedRun.status === "Draft") && (
                <>
                  <button
                    className="button button-sm"
                    style={{ background: "var(--success)", color: "white", border: "1px solid var(--success)" }}
                    onClick={() => { handleApprove(selectedRun); setShowViewModal(false); }}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    className="button button-sm"
                    style={{ background: "var(--danger)", color: "white", border: "1px solid var(--danger)" }}
                    onClick={() => { handleReject(selectedRun); setShowViewModal(false); }}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </>
              )}
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
