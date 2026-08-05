import { useState } from "react";
import { Plus, Search, RefreshCw, Download, Eye, Edit, X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { usePayrollCreation } from "../hooks/usePayrollCreation";
import { actions } from "../../../../services/api/resources";
import { Link } from "react-router-dom";

export default function PayrollCreationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [runName, setRunName] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<"Kenya" | "US">("Kenya");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const { runs, isLoading, error, createRun, updateRun } = usePayrollCreation();

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
    a.download = "payroll-runs.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Payroll runs exported", "success");
  };

  const handleCreateRun = () => {
    if (!runName.trim() || !periodStart || !periodEnd || !paymentDate) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    createRun({
      name: runName,
      period: `${periodStart}|${periodEnd}`,
      payment_date: paymentDate,
      status: "Draft",
      total_amount: 0,
      employee_count: 0,
    } as any);
    showToast("Payroll run created successfully", "success");
    setRunName("");
    setPaymentDate("");
    setPeriodStart("");
    setPeriodEnd("");
    setShowCreateModal(false);
  };

  const handleSubmitRun = async (id: number) => {
    try {
      await actions.submitPayroll(id);
      showToast("Payroll run submitted for approval", "success");
    } catch (err: any) {
      showToast(err?.message ?? "Could not submit payroll run", "error");
    }
  };

  const handleSaveEdit = () => {
    if (!selectedRun) return;
    updateRun({ id: selectedRun.id, payload: { name: runName, payment_date: paymentDate } });
    showToast("Payroll run updated", "success");
    setShowEditModal(false);
    setSelectedRun(null);
  };

  const openView = (run: any) => {
    setSelectedRun(run);
    setShowViewModal(true);
  };

  const openEdit = (run: any) => {
    setSelectedRun(run);
    setRunName(run.name ?? "");
    setPaymentDate(run.payment_date ?? "");
    setShowEditModal(true);
  };

  const filteredRuns = (runs as any[]).filter((run: any) =>
    !searchTerm ||
    run.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    run.period?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    if (status === "Completed" || status === "Approved") return <CheckCircle size={14} />;
    if (status === "Draft") return <Clock size={14} />;
    return <AlertCircle size={14} />;
  };

  const getStatusTone = (status: string) => {
    if (status === "Completed" || status === "Approved") return "success";
    if (status === "Draft") return "info";
    if (status === "Rejected") return "danger";
    return "warning";
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="panel">
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <p className="page-subtitle">Loading payroll runs…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="alert alert-error">
          Unable to load payroll creation data. Ensure the backend is running.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page payroll-workspace">
      {/* Header */}
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Payroll creation workspace</div>
          <h1 className="page-title">Payroll Creation</h1>
          <p className="page-subtitle">
            Create and manage payroll runs. Draft runs are validated before submission to the approval queue.
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
            <button className="button button-primary" onClick={() => setShowCreateModal(true)}>
              <Plus aria-hidden="true" size={15} />
              Create Run
            </button>
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <section className="metrics" aria-label="Payroll creation summary">
        <div className="metric-cell">
          <div className="metric-label">Total Runs</div>
          <div className="metric-value">{(runs as any[]).length}</div>
          <div className="metric-meta">All time</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Draft Runs</div>
          <div className="metric-value">{(runs as any[]).filter((r: any) => r.status === "Draft").length}</div>
          <div className="metric-meta"><span className="pill pill-info">Pending validation</span></div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Submitted</div>
          <div className="metric-value">{(runs as any[]).filter((r: any) => r.status === "Submitted" || r.status === "Pending").length}</div>
          <div className="metric-meta"><span className="pill pill-warning">Awaiting approval</span></div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Approved / Completed</div>
          <div className="metric-value">{(runs as any[]).filter((r: any) => r.status === "Approved" || r.status === "Completed").length}</div>
          <div className="metric-meta"><span className="pill pill-success">Released</span></div>
        </div>
      </section>

      {/* Payroll Runs Table */}
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Payroll Runs</h3>
          <Link className="panel-action" to="/payroll/approval">Open approval queue</Link>
        </div>
        <div className="panel-body">
          <div className="payroll-table-controls">
            <div className="payroll-search-box">
              <Search aria-hidden="true" size={15} style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search runs by name or period…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="select-control"
                style={{ border: "none", padding: "4px 8px", minWidth: "220px" }}
              />
            </div>
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
                    No payroll runs found. Create one to get started.
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
                      <span className={`pill pill-${getStatusTone(run.status)}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        {getStatusIcon(run.status)}
                        {run.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-row" style={{ gap: "6px", justifyContent: "flex-end" }}>
                        <button
                          className="button button-secondary button-sm"
                          onClick={() => openView(run)}
                          title="View details"
                        >
                          <Eye size={14} /> View
                        </button>
                        {run.status === "Draft" && (
                          <>
                            <button
                              className="button button-secondary button-sm"
                              onClick={() => openEdit(run)}
                              title="Edit run"
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              className="button button-primary button-sm"
                              onClick={() => handleSubmitRun(run.id)}
                              title="Submit for approval"
                            >
                              Submit
                            </button>
                          </>
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

      {/* Create Run Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" role="presentation">
          <form className="payroll-modal" aria-label="Create payroll run" onSubmit={(e) => { e.preventDefault(); handleCreateRun(); }}>
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">New payroll run</div>
                <h2>Create Payroll Run</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="payroll-modal-grid">
              <label className="field-control">
                <span className="eyebrow">Run name *</span>
                <input className="select-control" value={runName} onChange={(e) => setRunName(e.target.value)} placeholder="e.g. July 2026 Payroll" required />
              </label>
              <label className="field-control">
                <span className="eyebrow">Payment date *</span>
                <input className="select-control" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
              </label>
              <label className="field-control">
                <span className="eyebrow">Period start *</span>
                <input className="select-control" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} required />
              </label>
              <label className="field-control">
                <span className="eyebrow">Period end *</span>
                <input className="select-control" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} required />
              </label>
              <label className="field-control">
                <span className="eyebrow">Country</span>
                <select className="select-control" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value as any)}>
                  <option value="Kenya">Kenya</option>
                  <option value="US">United States</option>
                </select>
              </label>
            </div>
            <div className="action-row payroll-modal-actions">
              <button className="button button-secondary" type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="button button-primary" type="submit">
                <Plus aria-hidden="true" size={15} /> Create Run
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Run Modal */}
      {showViewModal && selectedRun && (
        <div className="modal-backdrop" role="presentation">
          <div className="payroll-modal" aria-label="View payroll run">
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Payroll run detail</div>
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
              {selectedRun.notes && <div className="note"><p className="eyebrow">Notes</p><p className="compact-metric">{selectedRun.notes}</p></div>}
            </div>
            <div className="action-row payroll-modal-actions">
              {selectedRun.status === "Draft" && (
                <button className="button button-primary" onClick={() => { handleSubmitRun(selectedRun.id); setShowViewModal(false); }}>
                  Submit for Approval
                </button>
              )}
              <button className="button button-secondary" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Run Modal */}
      {showEditModal && selectedRun && (
        <div className="modal-backdrop" role="presentation">
          <form className="payroll-modal" aria-label="Edit payroll run" onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Edit payroll run</div>
                <h2>Edit: {selectedRun.name}</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => setShowEditModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="payroll-modal-grid">
              <label className="field-control">
                <span className="eyebrow">Run name *</span>
                <input className="select-control" value={runName} onChange={(e) => setRunName(e.target.value)} required />
              </label>
              <label className="field-control">
                <span className="eyebrow">Payment date</span>
                <input className="select-control" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
              </label>
            </div>
            <div className="action-row payroll-modal-actions">
              <button className="button button-secondary" type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="button button-primary" type="submit">Save Changes</button>
            </div>
          </form>
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
