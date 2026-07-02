import { Download, FileText, Mail, Pin } from "lucide-react";
import AttendanceLeaveOverview from "../components/AttendanceLeaveOverview";
import BenefitsOverview from "../components/BenefitsOverview";
import BranchScopeSelector from "../components/BranchScopeSelector";
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

export default function ExecutiveDashboardPage() {
  const { branches, data, selectedBranchId, setSelectedBranch } = useExecutiveDashboard();

  return (
    <div className="dashboard-page executive-dashboard">
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Strategic cross-branch visibility</div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">
            Aggregated HR, payroll, compliance, and workforce intelligence for {data.scope.label.toLowerCase()}.
          </p>
        </div>

        <div className="executive-toolbar">
          <BranchScopeSelector
            branches={branches}
            selectedBranchId={selectedBranchId}
            onBranchChange={setSelectedBranch}
          />
          <div className="action-row">
            <button className="button button-secondary" type="button">
              <FileText aria-hidden="true" size={15} />
              Compare
            </button>
            <button className="button button-secondary" type="button">
              <Mail aria-hidden="true" size={15} />
              Digest
            </button>
            <button className="button button-secondary" type="button">
              <Download aria-hidden="true" size={15} />
              Export
            </button>
          </div>
        </div>
      </div>

      <section className="metrics" aria-label="Executive dashboard summary">
        <div className="metric-cell">
          <div className="metric-label">Headcount</div>
          <div className="metric-value">{data.summary.headcount}</div>
          <div className="metric-meta">Aggregated across branch scope</div>
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

      <ExecutiveAlerts alerts={data.insights} />

      <div className="note executive-scope-note">
        <span className="pill pill-info">Read-only scope</span>
        {executiveScopeNote} Single-branch selection reuses the branch dashboard pattern in read-only executive mode.
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
          <button className="panel-action" type="button">Customize</button>
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
    </div>
  );
}
