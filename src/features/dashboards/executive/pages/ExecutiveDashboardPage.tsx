import { Download, Mail, Pin, Plus, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AttendanceLeaveOverview from "../components/AttendanceLeaveOverview";
import BenefitsOverview from "../components/BenefitsOverview";
import ComplianceRiskOverview from "../components/ComplianceRiskOverview";
import EngagementCulture from "../components/EngagementCulture";
import ExceptionApprovals from "../components/ExceptionApprovals";
import ExecutiveAlerts from "../components/ExecutiveAlerts";
import FinancialHrCrossover from "../components/FinancialHrCrossover";
import PayrollCostOverview from "../components/PayrollCostOverview";
import PerformanceProductivity from "../components/PerformanceProductivity";
import PredictiveInsights from "../components/PredictiveInsights";
import TimeToXMetrics from "../components/TimeToXMetrics";
import WorkforceOverview from "../components/WorkforceOverview";
import { executiveScopeNote } from "../constants/executiveDashboard.constants";
import { useExecutiveDashboard } from "../hooks/useExecutiveDashboard";
import { branchApi } from "../../../../services/api/department";

export default function ExecutiveDashboardPage() {
  const navigate = useNavigate();
  const [digestOpen, setDigestOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: "", code: "", location: "", phone: "", email: "" });
  const [branchMessage, setBranchMessage] = useState("");
  const [branchSaving, setBranchSaving] = useState(false);
  const { data, isLoading, error } = useExecutiveDashboard();

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name.trim() || !newBranch.code.trim()) {
      setBranchMessage("Branch name and code are required.");
      return;
    }
    setBranchSaving(true);
    try {
      await branchApi.create({
        name: newBranch.name.trim(),
        code: newBranch.code.trim(),
        location: newBranch.location.trim(),
        phone: newBranch.phone.trim(),
        email: newBranch.email.trim(),
      });
      setBranchMessage("Branch created successfully.");
      setNewBranch({ name: "", code: "", location: "", phone: "", email: "" });
      setTimeout(() => { setBranchModalOpen(false); setBranchMessage(""); }, 1500);
    } catch {
      setBranchMessage("Failed to create branch. Please try again.");
    } finally {
      setBranchSaving(false);
    }
  };

  const exportDashboardData = () => {
    if (!data) return;
    const csvRows = [
      "Metric,Value",
      `Headcount,${data.summary.headcount}`,
      `Payroll Cost (KES),${data.summary.payrollCost}`,
      `Payroll Revenue %,${data.summary.payrollRevenuePercent}`,
      `Attrition Rate %,${data.summary.attritionRate}`,
      `Performance Completion %,${data.summary.performanceCompletion}`,
      `Absenteeism Rate %,${data.summary.absenteeismRate}`,
      "",
      "Workforce,HiresTrend",
      ...data.workforce.hiresTrend.map((p) => `${p.label},${p.value}`),
      "",
      "Payroll,CostTrend",
      ...data.payroll.costTrend.map((p) => `${p.label},${p.value}`),
      "",
      "Branch Attendance",
      ...data.attendance.absenteeismByBranch.map((b) => `${b.branchName},${b.value}%,${b.status}`),
      "",
      "Performance Ratings",
      ...data.performance.ratingDistribution.map((r) => `${r.label} stars,${r.value}`),
      "",
      "Pending Approvals",
      ...data.approvals.map((a) => `${a.title},${a.branchName},${a.value},${a.type}`),
      "",
      "Compliance Flags",
      ...data.compliance.flags.map((f) => `${f.branchName},${f.status}`),
    ];
    const csv = csvRows.join("\n");
    const href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = href;
    link.download = `executive-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(href);
  };

  if (isLoading || !data) {
    return (
      <div className="dashboard-page">
        <div className="panel panel-body" style={{ textAlign: "center", padding: "48px" }}>
          <p className="page-subtitle">Loading live executive metrics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="panel panel-body" style={{ textAlign: "center", padding: "48px" }}>
          <p className="alert alert-error">Unable to load live executive metrics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page executive-dashboard">
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Strategic branch visibility</div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">
            Aggregated HR, payroll, compliance, and workforce intelligence for {data.scope.label.toLowerCase()}.
          </p>
        </div>
        <div className="executive-toolbar">
          <div className="action-row">
            <button className="button button-secondary" type="button" onClick={() => setDigestOpen((open) => !open)}>
              <Mail aria-hidden="true" size={15} />
              Digest
            </button>
            <button className="button button-secondary" type="button" onClick={exportDashboardData}>
              <Download aria-hidden="true" size={15} />
              Export
            </button>
            <button className="button button-primary" type="button" onClick={() => setBranchModalOpen(true)}>
              <Plus aria-hidden="true" size={15} />
              Add Branch
            </button>
          </div>
        </div>
      </div>

      {digestOpen && (
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Live executive digest</h3>
            <button className="panel-action" onClick={() => setDigestOpen(false)}>Close</button>
          </div>
          <div className="panel-body usability-grid">
            <div className="note">
              <strong>Workforce:</strong> {data.summary.headcount} employees in {data.scope.label}; attendance absence rate is {data.summary.absenteeismRate}%.
            </div>
            <div className="note">
              <strong>Payroll:</strong> KES {data.summary.payrollCost.toLocaleString()} in approved/finalized payroll runs.
            </div>
            <div className="note">
              <strong>Actions:</strong> {data.approvals.length} pending leave approvals and {data.compliance.flags.length} open disciplinary items in the current scope.
            </div>
          </div>
        </section>
      )}

      <section className="metrics" aria-label="Executive dashboard summary">
        <div className="metric-cell">
          <div className="metric-label">Headcount</div>
          <div className="metric-value">{data.summary.headcount}</div>
          <div className="metric-meta">Current branch workforce</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Payroll cost</div>
          <div className="metric-value">KES {(data.summary.payrollCost / 1000000).toFixed(1)}M</div>
          <div className="metric-meta">{data.summary.payrollRevenuePercent}% of revenue</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Performance</div>
          <div className="metric-value">{data.summary.performanceCompletion}%</div>
          <div className="metric-meta">Goal / KPI completion</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Risk</div>
          <div className="metric-value">{data.summary.attritionRate}%</div>
          <div className="metric-meta">Weighted attrition rate</div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Company Overview</h3>
          <Link className="panel-action" to="/hr-dashboard">View HR dashboard</Link>
        </div>
        <div className="panel-body usability-grid">
          <div className="note"><strong>Operating branch:</strong> {data.scope.label}</div>
          <div className="note"><strong>Company scope:</strong> workforce, payroll, attendance, leave, compliance, benefits, performance, and HR risk.</div>
          <div className="note"><strong>Live drill-down:</strong> select a branch below to open the HR dashboard for operational follow-up.</div>
        </div>
      </section>

      <ExecutiveAlerts alerts={data.insights} />

      <div className="note executive-scope-note">
        <span className="pill pill-info">Read-only scope</span>
        {executiveScopeNote} This executive view is limited to your configured branch.
      </div>

      <div className="grid-main">
        <WorkforceOverview data={data} />
        <PayrollCostOverview data={data} />
      </div>

      <div className="grid-2col">
        <PerformanceProductivity data={data} />
        <AttendanceLeaveOverview data={data} />
      </div>

      <div className="grid-2col">
        <ComplianceRiskOverview data={data} />
        <BenefitsOverview data={data} />
      </div>

      <ExceptionApprovals approvals={data.approvals} />

      <div className="grid-main">
        <PredictiveInsights insights={data.insights} />
        <EngagementCulture data={data} />
      </div>

      <div className="grid-2col">
        <TimeToXMetrics data={data} />
        <FinancialHrCrossover data={data} />
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Usability Controls</h3>
          <Link className="panel-action" to="/user-profile">Customize</Link>
        </div>
        <div className="panel-body usability-grid">
          <div className="note">
            <Pin aria-hidden="true" size={15} />
            Pinnable widgets are prepared at section level for future user preferences.
          </div>
          <div className="note">Scheduled weekly/monthly digest controls are represented here for the next backend phase.</div>
          <div className="note">Alert drill-downs are designed to route to branch or department detail once those pages are implemented.</div>
        </div>
      </section>

      {/* Add Branch Modal */}
      {branchModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <form className="module-modal" onSubmit={handleAddBranch}>
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Branch management</div>
                <h2>Add New Branch</h2>
              </div>
              <button className="panel-action" type="button" onClick={() => { setBranchModalOpen(false); setBranchMessage(""); }}>
                <X size={18} />
              </button>
            </div>
            {branchMessage && (
              <div style={{ padding: "10px 18px", background: branchMessage.includes("success") ? "var(--success-bg)" : "var(--danger-bg)", color: branchMessage.includes("success") ? "var(--success)" : "var(--danger)", borderRadius: "6px", margin: "0 18px 10px" }}>
                {branchMessage}
              </div>
            )}
            <div className="payroll-modal-grid">
              <label className="field-control">
                <span className="eyebrow">Branch name *</span>
                <input className="select-control" value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} placeholder="e.g. Mombasa Branch" required />
              </label>
              <label className="field-control">
                <span className="eyebrow">Branch code *</span>
                <input className="select-control" value={newBranch.code} onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })} placeholder="e.g. MSA-001" required />
              </label>
              <label className="field-control">
                <span className="eyebrow">Location</span>
                <input className="select-control" value={newBranch.location} onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })} placeholder="e.g. Mombasa, Kenya" />
              </label>
              <label className="field-control">
                <span className="eyebrow">Phone</span>
                <input className="select-control" value={newBranch.phone} onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })} placeholder="e.g. +254 700 000 000" />
              </label>
              <label className="field-control">
                <span className="eyebrow">Email</span>
                <input className="select-control" type="email" value={newBranch.email} onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })} placeholder="branch@company.com" />
              </label>
            </div>
            <div className="action-row payroll-modal-actions">
              <button className="button button-secondary" type="button" onClick={() => { setBranchModalOpen(false); setBranchMessage(""); }}>Cancel</button>
              <button className="button button-primary" type="submit" disabled={branchSaving}>
                {branchSaving ? "Saving…" : <><Plus aria-hidden="true" size={15} /> Create Branch</>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
