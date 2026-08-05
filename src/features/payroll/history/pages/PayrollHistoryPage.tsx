import { useState } from "react";
import { Search, Download, RefreshCw, Eye, X, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { resources, actions } from "../../../../services/api/resources";
import { Link } from "react-router-dom";

type PayrollRun = {
  id: number;
  name: string;
  period: string;
  payment_date?: string;
  status: string;
  total_amount?: number;
  employee_count?: number;
  notes?: string;
  created_at?: string;
};

export default function PayrollHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const { data: runs = [], isLoading, error, refetch } = useQuery<PayrollRun[]>({
    queryKey: ["payroll-runs-history"],
    queryFn: () => resources.payrollRuns.list() as Promise<PayrollRun[]>,
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRefresh = () => {
    refetch();
    showToast("Payroll history refreshed", "info");
  };

  const handleExport = () => {
    const csv = [
      ["Run Name", "Period", "Payment Date", "Total Amount", "Employees", "Status"],
      ...filteredRuns.map((run) => [
        run.name,
        run.period,
        run.payment_date ?? "—",
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
    a.download = "payroll-history.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Payroll history exported", "success");
  };

  const handleDownloadPayslips = async (run: PayrollRun) => {
    try {
      // Download payslips for the run — fetch all payslips for this run
      const payslips = await resources.payslips.list({ payroll_run: run.id });
      if (!payslips.length) {
        showToast("No payslips found for this run", "info");
        return;
      }
      // Download the first payslip as a sample
      const response = await actions.downloadPayslip(payslips[0].id);
      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslips-${run.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Payslips downloaded", "success");
    } catch (err: any) {
      showToast(err?.message ?? "Could not download payslips", "error");
    }
  };

  const filteredRuns = runs.filter((run) => {
    const matchesSearch =
      !searchTerm ||
      run.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.period?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusTone = (status: string) => {
    if (status === "Approved" || status === "Completed" || status === "Paid") return "success";
    if (status === "Rejected" || status === "Cancelled" || status === "Failed") return "danger";
    if (status === "Submitted" || status === "Pending") return "warning";
    return "info";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Approved" || status === "Completed" || status === "Paid") return <CheckCircle size={14} />;
    if (status === "Rejected" || status === "Cancelled" || status === "Failed") return <XCircle size={14} />;
    if (status === "Submitted" || status === "Pending") return <AlertCircle size={14} />;
    return <Clock size={14} />;
  };

  const totalPaid = runs
    .filter((r) => r.status === "Approved" || r.status === "Completed" || r.status === "Paid")
    .reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0);

  const formatKes = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="panel">
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <p className="page-subtitle">Loading payroll history…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="alert alert-error">
          Unable to load payroll history. Ensure the backend is running.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page payroll-workspace">
      {/* Header */}
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Payroll archive</div>
          <h1 className="page-title">Payroll History</h1>
          <p className="page-subtitle">
            Review completed payroll runs, audit packets, variance trends, and statutory submission status.
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
      <section className="metrics" aria-label="Payroll history summary">
        <div className="metric-cell">
          <div className="metric-label">Total Runs</div>
          <div className="metric-value">{runs.length}</div>
          <div className="metric-meta">All time</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Total Paid</div>
          <div className="metric-value" style={{ fontSize: "1.2rem" }}>{formatKes(totalPaid)}</div>
          <div className="metric-meta"><span className="pill pill-success">Disbursed</span></div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Completed Runs</div>
          <div className="metric-value">{runs.filter((r) => r.status === "Approved" || r.status === "Completed" || r.status === "Paid").length}</div>
          <div className="metric-meta"><span className="pill pill-success">Fully paid</span></div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Pending / Draft</div>
          <div className="metric-value">{runs.filter((r) => r.status === "Draft" || r.status === "Pending" || r.status === "Submitted").length}</div>
          <div className="metric-meta"><span className="pill pill-warning">In progress</span></div>
        </div>
      </section>

      {/* History Table */}
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Payroll Run History</h3>
          <Link className="panel-action" to="/payroll/approval">Open approval queue</Link>
        </div>
        <div className="panel-body">
          <div className="payroll-table-controls">
            <div className="payroll-search-box">
              <Search aria-hidden="true" size={15} style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search by name or period…"
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
              <option value="Completed">Completed</option>
              <option value="Paid">Paid</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Run Name</th>
                <th>Period</th>
                <th>Payment Date</th>
                <th>Total Amount</th>
                <th>Employees</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                    No payroll history found.
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => (
                  <tr key={run.id}>
                    <td style={{ fontWeight: 700 }}>{run.name}</td>
                    <td>{run.period}</td>
                    <td>{run.payment_date ? new Date(run.payment_date).toLocaleDateString("en-KE") : "—"}</td>
                    <td style={{ fontWeight: 700 }}>{formatKes(Number(run.total_amount ?? 0))}</td>
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
                          onClick={() => { setSelectedRun(run); setShowViewModal(true); }}
                          title="View details"
                        >
                          <Eye size={14} /> View
                        </button>
                        {(run.status === "Approved" || run.status === "Completed" || run.status === "Paid") && (
                          <button
                            className="button button-secondary button-sm"
                            onClick={() => handleDownloadPayslips(run)}
                            title="Download payslips"
                          >
                            <Download size={14} /> Payslips
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
                <div className="page-kicker">Payroll run archive</div>
                <h2>{selectedRun.name}</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="section-stack" style={{ marginTop: "16px" }}>
              <div className="note"><p className="eyebrow">Period</p><p className="compact-metric">{selectedRun.period ?? "—"}</p></div>
              <div className="note"><p className="eyebrow">Payment Date</p><p className="compact-metric">{selectedRun.payment_date ? new Date(selectedRun.payment_date).toLocaleDateString("en-KE") : "—"}</p></div>
              <div className="note"><p className="eyebrow">Total Amount</p><p className="compact-metric" style={{ color: "var(--success)", fontWeight: 700 }}>{formatKes(Number(selectedRun.total_amount ?? 0))}</p></div>
              <div className="note"><p className="eyebrow">Employees</p><p className="compact-metric">{selectedRun.employee_count ?? "—"}</p></div>
              <div className="note"><p className="eyebrow">Status</p><span className={`pill pill-${getStatusTone(selectedRun.status)}`}>{selectedRun.status}</span></div>
              {selectedRun.notes && <div className="note"><p className="eyebrow">Notes</p><p className="compact-metric">{selectedRun.notes}</p></div>}
              {selectedRun.created_at && <div className="note"><p className="eyebrow">Created</p><p className="compact-metric">{new Date(selectedRun.created_at).toLocaleDateString("en-KE")}</p></div>}
            </div>
            <div className="action-row payroll-modal-actions">
              {(selectedRun.status === "Approved" || selectedRun.status === "Completed" || selectedRun.status === "Paid") && (
                <button className="button button-secondary" onClick={() => handleDownloadPayslips(selectedRun)}>
                  <Download size={14} /> Download Payslips
                </button>
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
