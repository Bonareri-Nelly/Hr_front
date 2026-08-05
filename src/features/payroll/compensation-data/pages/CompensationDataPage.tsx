import { useState } from "react";
import { Search, Download, RefreshCw, Eye, Plus, X, CreditCard, ShieldCheck, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resources, type ApiRecord } from "../../../../services/api/resources";
import { Link } from "react-router-dom";

type PayComponent = ApiRecord & {
  name: string;
  component_type?: string;
  type?: string;
  amount?: number;
  rate?: number;
  description?: string;
  is_taxable?: boolean;
  is_active?: boolean;
};

type EmployeeComponent = ApiRecord & {
  employee?: number;
  component?: number;
  component_name?: string;
  amount?: number;
  effective_date?: string;
  status?: string;
};

type Employee = ApiRecord & {
  full_name?: string;
  name?: string;
  employee_code?: string;
  department?: string;
  position?: string;
};

export default function CompensationDataPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedComponent, setSelectedComponent] = useState<PayComponent | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("allowance");
  const [newAmount, setNewAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const { data: components = [], isLoading: componentsLoading, error: componentsError, refetch } = useQuery<PayComponent[]>({
    queryKey: ["pay-components"],
    queryFn: () => resources.payComponents.list() as Promise<PayComponent[]>,
  });

  const { data: employeeComponents = [] } = useQuery<EmployeeComponent[]>({
    queryKey: ["employee-components"],
    queryFn: () => resources.employeeComponents.list() as Promise<EmployeeComponent[]>,
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employees-compensation"],
    queryFn: () => resources.employees.list() as Promise<Employee[]>,
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<PayComponent>) => resources.payComponents.create(payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pay-components"] });
      showToast("Compensation component added successfully", "success");
      setShowAddModal(false);
      setNewName("");
      setNewType("allowance");
      setNewAmount("");
      setNewDescription("");
    },
    onError: (err: any) => showToast(err?.message ?? "Could not add component", "error"),
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRefresh = () => {
    refetch();
    showToast("Compensation data refreshed", "info");
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Type", "Amount", "Taxable", "Active"],
      ...filteredComponents.map((c) => [
        c.name,
        c.component_type ?? c.type ?? "—",
        c.amount ?? c.rate ?? "—",
        c.is_taxable ? "Yes" : "No",
        c.is_active !== false ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compensation-data.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Compensation data exported", "success");
  };

  const handleAddComponent = () => {
    if (!newName.trim()) {
      showToast("Component name is required", "error");
      return;
    }
    createMutation.mutate({
      name: newName,
      component_type: newType,
      type: newType,
      amount: newAmount ? Number(newAmount) : undefined,
      description: newDescription,
      is_active: true,
    } as any);
  };

  const allTypes = ["All", ...Array.from(new Set(components.map((c) => c.component_type ?? c.type ?? "other")))];

  const filteredComponents = components.filter((c) => {
    const matchesSearch = !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || (c.component_type ?? c.type) === typeFilter;
    return matchesSearch && matchesType;
  });

  const allowances = components.filter((c) => (c.component_type ?? c.type ?? "").toLowerCase().includes("allowance"));
  const deductions = components.filter((c) => (c.component_type ?? c.type ?? "").toLowerCase().includes("deduction"));
  const totalEmployeeComponents = employeeComponents.length;

  if (componentsLoading) {
    return (
      <div className="dashboard-page">
        <div className="panel">
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <p className="page-subtitle">Loading compensation data…</p>
          </div>
        </div>
      </div>
    );
  }

  if (componentsError) {
    return (
      <div className="dashboard-page">
        <div className="alert alert-error">
          Unable to load compensation data. Ensure the backend is running.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page payroll-workspace">
      {/* Header */}
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Pay data control</div>
          <h1 className="page-title">Compensation Data</h1>
          <p className="page-subtitle">
            Maintain salary bands, allowances, deductions, benefits, and employee compensation snapshots.
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
            <button className="button button-primary" onClick={() => setShowAddModal(true)}>
              <Plus aria-hidden="true" size={15} />
              Add Component
            </button>
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <section className="metrics" aria-label="Compensation summary">
        <div className="metric-cell">
          <div className="metric-label">Pay Components</div>
          <div className="metric-value">{components.length}</div>
          <div className="metric-meta">Configured</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Allowances</div>
          <div className="metric-value">{allowances.length}</div>
          <div className="metric-meta"><span className="pill pill-success">Active</span></div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Deductions</div>
          <div className="metric-value">{deductions.length}</div>
          <div className="metric-meta"><span className="pill pill-warning">Applied</span></div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Employee Assignments</div>
          <div className="metric-value">{totalEmployeeComponents}</div>
          <div className="metric-meta"><span className="pill pill-info">Linked</span></div>
        </div>
      </section>

      {/* Focus band */}
      <section className="payroll-focus-band" aria-label="Compensation status">
        <div className="payroll-focus-copy">
          <span className="payroll-focus-icon">
            <CreditCard aria-hidden="true" size={20} />
          </span>
          <div>
            <div className="eyebrow">Current focus</div>
            <h2>Compensation data is the payroll source of truth.</h2>
            <p>All salary, allowances, and deductions must reconcile to employee contracts before payroll lock.</p>
          </div>
        </div>
        <div className="payroll-focus-stats">
          <div><strong>{components.length}</strong><span>Components</span></div>
          <div><strong>{employees.length}</strong><span>Employees</span></div>
          <div><strong>{totalEmployeeComponents}</strong><span>Assignments</span></div>
        </div>
      </section>

      <div className="grid-main">
        {/* Pay Components Table */}
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Pay Components</h3>
            <Link className="panel-action" to="/payroll/creation">Use in payroll</Link>
          </div>
          <div className="panel-body">
            <div className="payroll-table-controls">
              <div className="payroll-search-box">
                <Search aria-hidden="true" size={15} style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search components…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="select-control"
                  style={{ border: "none", padding: "4px 8px", minWidth: "180px" }}
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="select-control"
                style={{ minWidth: "160px" }}
              >
                {allTypes.map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
              </select>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Amount / Rate</th>
                  <th>Taxable</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Detail</th>
                </tr>
              </thead>
              <tbody>
                {filteredComponents.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No pay components found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  filteredComponents.map((comp) => (
                    <tr key={comp.id}>
                      <td style={{ fontWeight: 700 }}>{comp.name}</td>
                      <td>
                        <span className={`pill pill-${(comp.component_type ?? comp.type ?? "").toLowerCase().includes("deduction") ? "danger" : "info"}`}>
                          {comp.component_type ?? comp.type ?? "—"}
                        </span>
                      </td>
                      <td>{comp.amount != null ? `KES ${Number(comp.amount).toLocaleString()}` : comp.rate != null ? `${Number(comp.rate).toFixed(2)}%` : "—"}</td>
                      <td>
                        <span className={`pill pill-${comp.is_taxable ? "warning" : "success"}`}>
                          {comp.is_taxable ? "Taxable" : "Non-taxable"}
                        </span>
                      </td>
                      <td>
                        <span className={`pill pill-${comp.is_active !== false ? "success" : "danger"}`}>
                          {comp.is_active !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="button button-secondary button-sm"
                          onClick={() => { setSelectedComponent(comp); setShowViewModal(true); }}
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

        {/* Employee Component Assignments */}
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Recent Assignments</h3>
          </div>
          <div className="panel-body">
            {employeeComponents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px" }}>
                <p className="page-subtitle">No employee component assignments yet.</p>
              </div>
            ) : (
              <ul className="run-list">
                {employeeComponents.slice(0, 8).map((ec) => {
                  const emp = employees.find((e) => Number(e.id) === Number(ec.employee));
                  const comp = components.find((c) => Number(c.id) === Number(ec.component));
                  return (
                    <li className="run-item" key={ec.id}>
                      <div className="payroll-progress-row">
                        <div>
                          <div className="run-title">{emp?.full_name ?? emp?.name ?? `Employee #${ec.employee}`}</div>
                          <div className="run-meta">{comp?.name ?? ec.component_name ?? `Component #${ec.component}`}</div>
                        </div>
                        <span className={`pill pill-${ec.status === "active" ? "success" : ec.status === "pending" ? "warning" : "info"}`}>
                          {ec.status ?? "active"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Audit note */}
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Data Quality</h3>
        </div>
        <div className="panel-body">
          <div className="note payroll-note">
            <ShieldCheck aria-hidden="true" size={17} />
            <span>Compensation data is locked as a dated snapshot for every payroll run. Ensure all components are reviewed before payroll creation.</span>
          </div>
          <div className="payroll-control-grid">
            <div className="payroll-control-cell">
              <CreditCard aria-hidden="true" size={17} />
              <span>Components</span>
              <strong>{components.length} configured</strong>
            </div>
            <div className="payroll-control-cell">
              <CheckCircle aria-hidden="true" size={17} />
              <span>Active</span>
              <strong>{components.filter((c) => c.is_active !== false).length} active</strong>
            </div>
            <div className="payroll-control-cell">
              <ShieldCheck aria-hidden="true" size={17} />
              <span>Assignments</span>
              <strong>{totalEmployeeComponents} linked</strong>
            </div>
          </div>
        </div>
      </section>

      {/* View Component Modal */}
      {showViewModal && selectedComponent && (
        <div className="modal-backdrop" role="presentation">
          <div className="payroll-modal" aria-label="Pay component detail">
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Pay component</div>
                <h2>{selectedComponent.name}</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="section-stack" style={{ marginTop: "16px" }}>
              <div className="note"><p className="eyebrow">Type</p><p className="compact-metric">{selectedComponent.component_type ?? selectedComponent.type ?? "—"}</p></div>
              <div className="note"><p className="eyebrow">Amount / Rate</p><p className="compact-metric">{selectedComponent.amount != null ? `KES ${Number(selectedComponent.amount).toLocaleString()}` : selectedComponent.rate != null ? `${Number(selectedComponent.rate).toFixed(2)}%` : "—"}</p></div>
              <div className="note"><p className="eyebrow">Taxable</p><p className="compact-metric">{selectedComponent.is_taxable ? "Yes" : "No"}</p></div>
              <div className="note"><p className="eyebrow">Status</p><span className={`pill pill-${selectedComponent.is_active !== false ? "success" : "danger"}`}>{selectedComponent.is_active !== false ? "Active" : "Inactive"}</span></div>
              {selectedComponent.description && <div className="note"><p className="eyebrow">Description</p><p className="compact-metric">{selectedComponent.description}</p></div>}
            </div>
            <div className="action-row payroll-modal-actions">
              <button className="button button-secondary" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Component Modal */}
      {showAddModal && (
        <div className="modal-backdrop" role="presentation">
          <form className="payroll-modal" aria-label="Add pay component" onSubmit={(e) => { e.preventDefault(); handleAddComponent(); }}>
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">New component</div>
                <h2>Add Pay Component</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="payroll-modal-grid">
              <label className="field-control">
                <span className="eyebrow">Name *</span>
                <input className="select-control" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Housing Allowance" required />
              </label>
              <label className="field-control">
                <span className="eyebrow">Type</span>
                <select className="select-control" value={newType} onChange={(e) => setNewType(e.target.value)}>
                  <option value="allowance">Allowance</option>
                  <option value="deduction">Deduction</option>
                  <option value="benefit">Benefit</option>
                  <option value="bonus">Bonus</option>
                  <option value="tax">Tax</option>
                </select>
              </label>
              <label className="field-control">
                <span className="eyebrow">Amount (KES)</span>
                <input className="select-control" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="e.g. 5000" min="0" />
              </label>
              <label className="field-control" style={{ gridColumn: "1 / -1" }}>
                <span className="eyebrow">Description</span>
                <input className="select-control" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Optional description" />
              </label>
            </div>
            <div className="action-row payroll-modal-actions">
              <button className="button button-secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="button button-primary" type="submit" disabled={createMutation.isPending}>
                <Plus aria-hidden="true" size={15} />
                {createMutation.isPending ? "Adding…" : "Add Component"}
              </button>
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
