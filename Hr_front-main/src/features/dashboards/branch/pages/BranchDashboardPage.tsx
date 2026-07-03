import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  MapPin,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import BranchScopeSelector from "../../executive/components/BranchScopeSelector";
import { ALL_BRANCHES_VALUE } from "../../executive/constants/executiveDashboard.constants";
import { useExecutiveDashboard } from "../../executive/hooks/useExecutiveDashboard";

type Tone = "success" | "warning" | "danger" | "info";

const teamRows: Array<[string, string, string, string, string, Tone]> = [
  ["Front Office", "Winnie Adera", "12", "100%", "Covered", "success"],
  ["Operations", "David Kariuki", "21", "93%", "Review", "warning"],
  ["Customer Service", "Nadia Osman", "18", "96%", "Covered", "success"],
  ["Finance Desk", "Peter Mwangi", "7", "89%", "Attention", "danger"],
  ["Field Sales", "Eunice Njeri", "10", "95%", "Covered", "success"],
];

const branchActions: Array<{ title: string; owner: string; due: string; tone: Tone }> = [
  { title: "Approve 4 leave cover plans", owner: "Operations", due: "Today", tone: "danger" },
  { title: "Clear two payroll bank changes", owner: "Finance Desk", due: "Today", tone: "warning" },
  { title: "Submit branch safety checklist", owner: "Front Office", due: "Tomorrow", tone: "info" },
  { title: "Confirm field sales attendance notes", owner: "Field Sales", due: "Friday", tone: "warning" },
];

const readinessSignals: Array<{ label: string; value: string; percent: number; tone: Tone }> = [
  { label: "Employee files verified", value: "64 / 68", percent: 94, tone: "success" },
  { label: "Mandatory training complete", value: "59 / 68", percent: 87, tone: "warning" },
  { label: "Payroll changes reconciled", value: "66 / 68", percent: 97, tone: "success" },
  { label: "Open conduct cases", value: "2 active cases", percent: 18, tone: "danger" },
];

const shiftCoverage = [
  ["Morning", "24", "98%"],
  ["Midday", "31", "95%"],
  ["Evening", "13", "91%"],
  ["On leave", "6", "Covered"],
];

const approvals: Array<{ label: string; count: string; icon: typeof CalendarCheck; tone: Tone }> = [
  { label: "Leave requests", count: "7", icon: CalendarCheck, tone: "warning" },
  { label: "Attendance edits", count: "3", icon: CalendarClock, tone: "info" },
  { label: "Payroll updates", count: "2", icon: Banknote, tone: "danger" },
  { label: "Contract actions", count: "2", icon: FileCheck2, tone: "success" },
];

function ActionIcon({ tone }: { tone: Tone }) {
  if (tone === "danger") {
    return <AlertTriangle aria-hidden="true" size={16} />;
  }

  if (tone === "success") {
    return <CheckCircle2 aria-hidden="true" size={16} />;
  }

  if (tone === "info") {
    return <ClipboardCheck aria-hidden="true" size={16} />;
  }

  return <CalendarClock aria-hidden="true" size={16} />;
}

export default function BranchDashboardPage() {
  const { branches, data, selectedBranchId, setSelectedBranch } = useExecutiveDashboard();
  const activeBranchId = selectedBranchId === ALL_BRANCHES_VALUE ? branches[0]?.id : selectedBranchId;
  const activeBranch = branches.find((branch) => branch.id === activeBranchId);
  const activeBranchName = activeBranch?.name ?? data.scope.label;
  const executivePath =
    activeBranchId && activeBranchId !== ALL_BRANCHES_VALUE
      ? `/dashboard/executive?branch_id=${activeBranchId}`
      : "/dashboard/executive";
  const branchMetrics: Array<{ label: string; value: string; meta: string; tone: Tone }> = [
    { label: "Branch headcount", value: String(data.summary.headcount), meta: "Synced from executive", tone: "success" },
    {
      label: "Attendance today",
      value: `${(100 - data.summary.absenteeismRate).toFixed(1)}%`,
      meta: `${data.summary.absenteeismRate}% absenteeism risk`,
      tone: "warning",
    },
    {
      label: "Payroll cost",
      value: `KES ${(data.summary.payrollCost / 1000000).toFixed(1)}M`,
      meta: `${data.summary.payrollRevenuePercent}% of revenue`,
      tone: "info",
    },
    { label: "Executive approvals", value: String(data.approvals.length), meta: "Escalated items", tone: "danger" },
  ];

  return (
    <div className="dashboard-page branch-manager-dashboard">
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Branch operations workspace</div>
          <h1 className="page-title">Branch Manager</h1>
          <p className="page-subtitle">
            Manage branch staffing, attendance exceptions, payroll readiness, compliance tasks, and approvals for {activeBranchName}.
          </p>
        </div>

        <div className="executive-toolbar">
          <BranchScopeSelector
            branches={branches}
            selectedBranchId={activeBranchId ?? selectedBranchId}
            onBranchChange={setSelectedBranch}
          />
          <div className="action-row">
            <Link className="button button-secondary" to={executivePath}>
              <ArrowLeft aria-hidden="true" size={15} />
              Executive
            </Link>
            <button className="button button-secondary" type="button">
              <Download aria-hidden="true" size={15} />
              Export
            </button>
            <button className="button button-primary" type="button">
              <Plus aria-hidden="true" size={15} />
              New Action
            </button>
          </div>
        </div>
      </div>

      <section className="metrics" aria-label="Branch manager summary metrics">
        {branchMetrics.map((metric) => (
          <div className="metric-cell" key={metric.label}>
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-meta">
              <span className={`pill pill-${metric.tone}`}>{metric.meta}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="branch-focus-band" aria-label="Current branch focus">
        <div className="branch-focus-copy">
          <span className="branch-focus-icon">
            <MapPin aria-hidden="true" size={20} />
          </span>
          <div>
            <div className="eyebrow">Current focus</div>
            <h2>{activeBranchName} needs payroll and leave cover decisions before close of day.</h2>
            <p>
              Six manager approvals are due today, with payroll bank changes and operations leave coverage carrying the
              highest impact on tomorrow's roster.
            </p>
          </div>
        </div>
        <div className="branch-focus-stats">
          <div>
            <strong>6</strong>
            <span>Due today</span>
          </div>
          <div>
            <strong>{data.summary.performanceCompletion}%</strong>
            <span>Performance</span>
          </div>
          <div>
            <strong>{data.summary.absenteeismRate}%</strong>
            <span>Absenteeism</span>
          </div>
        </div>
      </section>

      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Team Coverage</h3>
            <button className="panel-action" type="button">Open roster</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Lead</th>
                  <th>Staff</th>
                  <th>Attendance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamRows.map(([team, lead, staff, attendance, status, tone]) => (
                  <tr key={team}>
                    <td>{team}</td>
                    <td>{lead}</td>
                    <td>{staff}</td>
                    <td>{attendance}</td>
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
            <h3 className="panel-title">Executive Signals</h3>
            <Link className="panel-action" to={executivePath}>Open executive</Link>
          </div>
          <div className="panel-body">
            <ul className="branch-action-list">
              {data.insights.map((item) => (
                <li className="branch-action-item" key={item.id}>
                  <span className={`branch-action-icon branch-action-icon-${item.tone}`}>
                    <ActionIcon tone={item.tone} />
                  </span>
                  <div>
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-meta">{item.detail}</div>
                  </div>
                  <span className={`pill pill-${item.tone}`}>{item.tone}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Manager Actions</h3>
            <button className="panel-action" type="button">Assign</button>
          </div>
          <div className="panel-body">
            <ul className="branch-action-list">
              {branchActions.map((item) => (
                <li className="branch-action-item" key={item.title}>
                  <span className={`branch-action-icon branch-action-icon-${item.tone}`}>
                    <ActionIcon tone={item.tone} />
                  </span>
                  <div>
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-meta">{item.owner}</div>
                  </div>
                  <span className={`pill pill-${item.tone}`}>{item.due}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Executive Approvals</h3>
            <Link className="panel-action" to={executivePath}>Escalations</Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Value</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {data.approvals.map((approval) => (
                  <tr key={approval.id}>
                    <td>{approval.title}</td>
                    <td>{approval.value}</td>
                    <td>
                      <span className="pill pill-warning">{approval.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Approval Queue</h3>
            <button className="panel-action" type="button">Review queue</button>
          </div>
          <div className="panel-body">
            <div className="branch-approval-grid">
              {approvals.map((approval) => {
                const Icon = approval.icon;

                return (
                  <div className="branch-approval-cell" key={approval.label}>
                    <span className={`branch-action-icon branch-action-icon-${approval.tone}`}>
                      <Icon aria-hidden="true" size={16} />
                    </span>
                    <div>
                      <div className="metric-label">{approval.label}</div>
                      <div className="metric-value">{approval.count}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="note branch-note">
              <ShieldCheck aria-hidden="true" size={17} />
              <span>Branch approvals are prioritized by payroll impact, staffing coverage, and policy deadlines.</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Compliance Readiness</h3>
            <button className="panel-action" type="button">Review files</button>
          </div>
          <div className="panel-body">
            <ul className="run-list">
              {readinessSignals.map((signal) => (
                <li className="run-item" key={signal.label}>
                  <div className="branch-progress-row">
                    <div>
                      <div className="run-title">{signal.label}</div>
                      <div className="run-meta">{signal.value}</div>
                    </div>
                    <span className={`pill pill-${signal.tone}`}>{signal.percent}%</span>
                  </div>
                  <div className="progress" aria-label={`${signal.label} progress`}>
                    <span style={{ width: `${signal.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Shift Coverage</h3>
          <button className="panel-action" type="button">Workforce plan</button>
        </div>
        <div className="panel-body">
          <div className="branch-shift-grid">
            {shiftCoverage.map(([label, value, status]) => (
              <div className="branch-shift-cell" key={label}>
                <div className="metric-label">{label}</div>
                <div className="metric-value">{value}</div>
                <div className="metric-meta">{status} coverage</div>
              </div>
            ))}
          </div>
          <div className="note branch-note">
            <Users aria-hidden="true" size={17} />
            <span>Tomorrow's staffing plan should confirm evening cover and field sales attendance notes.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
