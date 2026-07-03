import {
  AlertTriangle,
  BadgeDollarSign,
  Banknote,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  Landmark,
  Plus,
  ReceiptText,
  RefreshCcw,
  Send,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

type Tone = "success" | "warning" | "danger" | "info";
type PayrollPageKey =
  | "overview"
  | "creation"
  | "approval"
  | "history"
  | "tax"
  | "bank"
  | "compensation"
  | "gl";

type Metric = { label: string; value: string; meta: string; tone: Tone };
type Action = { title: string; owner: string; due: string; tone: Tone };
type Signal = { label: string; value: string; percent: number; tone: Tone };
type TableRow = [string, string, string, string, string, Tone];

type PayrollConfig = {
  kicker: string;
  title: string;
  subtitle: string;
  primaryAction: string;
  secondaryAction: string;
  icon: typeof WalletCards;
  metrics: Metric[];
  focus: {
    title: string;
    detail: string;
    stats: Array<[string, string]>;
  };
  tableTitle: string;
  tableAction: string;
  tableActionPath: string;
  tableHeaders: [string, string, string, string, string];
  rows: TableRow[];
  actionsTitle: string;
  actions: Action[];
  signalsTitle: string;
  signals: Signal[];
  note: string;
};

const payrollConfigs: Record<PayrollPageKey, PayrollConfig> = {
  overview: {
    kicker: "Payroll command center",
    title: "Payroll",
    subtitle: "Monitor payroll readiness, exception risk, approval status, bank release health, and statutory submission progress.",
    primaryAction: "Start Run",
    secondaryAction: "Export",
    icon: WalletCards,
    metrics: [
      { label: "Gross payroll", value: "KES 18.6M", meta: "+4.2% vs last run", tone: "info" },
      { label: "Employees", value: "248", meta: "236 ready", tone: "success" },
      { label: "Exceptions", value: "12", meta: "5 high priority", tone: "warning" },
      { label: "Approval status", value: "71%", meta: "2 stages pending", tone: "danger" },
    ],
    focus: {
      title: "July payroll is ready for finance validation after twelve exception checks are cleared.",
      detail: "Bank details, tax PIN gaps, overtime variance, and contract changes are the blockers before final approval.",
      stats: [["236", "Ready records"], ["12", "Exceptions"], ["2", "Approvers left"]],
    },
    tableTitle: "Payroll Run Status",
    tableAction: "Open run",
    tableActionPath: "/payroll/creation",
    tableHeaders: ["Run", "Branch", "Employees", "Amount", "Status"],
    rows: [
      ["July Regular", "Eldoret Branch", "248", "KES 18.6M", "Review", "warning"],
      ["June Regular", "Eldoret Branch", "244", "KES 17.8M", "Paid", "success"],
      ["Overtime Batch", "Operations", "38", "KES 1.6M", "Approval", "danger"],
      ["Allowance Batch", "Field Sales", "42", "KES 920K", "Ready", "info"],
    ],
    actionsTitle: "Payroll Actions",
    actions: [
      { title: "Clear bank mismatch queue", owner: "Bank Integration", due: "Today", tone: "danger" },
      { title: "Approve overtime variance", owner: "Payroll Approval", due: "Today", tone: "warning" },
      { title: "Confirm statutory totals", owner: "Tax & Compliance", due: "Tomorrow", tone: "info" },
    ],
    signalsTitle: "Readiness Checks",
    signals: [
      { label: "Employee records locked", value: "236 / 248", percent: 95, tone: "success" },
      { label: "Bank accounts verified", value: "242 / 248", percent: 98, tone: "success" },
      { label: "Tax PINs complete", value: "239 / 248", percent: 96, tone: "warning" },
      { label: "Approvals complete", value: "5 / 7", percent: 71, tone: "danger" },
    ],
    note: "Payroll overview connects creation, approval, tax compliance, bank release, compensation data, and GL posting into one operational flow.",
  },
  creation: {
    kicker: "Run setup",
    title: "Payroll Creation",
    subtitle: "Build payroll runs from attendance, compensation, benefits, deductions, overtime, and one-time adjustments.",
    primaryAction: "Create Draft",
    secondaryAction: "Import Data",
    icon: BadgeDollarSign,
    metrics: [
      { label: "Draft run", value: "July", meta: "Regular payroll", tone: "info" },
      { label: "Input sources", value: "6 / 7", meta: "Benefits pending", tone: "warning" },
      { label: "Adjustments", value: "42", meta: "18 overtime", tone: "success" },
      { label: "Validation errors", value: "9", meta: "Needs cleanup", tone: "danger" },
    ],
    focus: {
      title: "Creation is waiting on benefits deductions and nine employee validation fixes.",
      detail: "Resolve missing tax PINs, duplicate overtime entries, and probation salary changes before locking the draft.",
      stats: [["7", "Inputs"], ["42", "Adjustments"], ["9", "Errors"]],
    },
    tableTitle: "Input Sources",
    tableAction: "Validate",
    tableActionPath: "/payroll/creation",
    tableHeaders: ["Source", "Owner", "Records", "Last sync", "Status"],
    rows: [
      ["Attendance", "Operations", "248", "08:10", "Ready", "success"],
      ["Benefits", "HR", "236", "07:45", "Pending", "warning"],
      ["Overtime", "Branch", "38", "08:02", "Review", "danger"],
      ["Compensation", "Payroll", "248", "07:30", "Ready", "success"],
    ],
    actionsTitle: "Creation Tasks",
    actions: [
      { title: "Resolve duplicate overtime entries", owner: "Operations", due: "Today", tone: "danger" },
      { title: "Import benefits deductions", owner: "HR Benefits", due: "Today", tone: "warning" },
      { title: "Lock compensation snapshot", owner: "Payroll", due: "Tomorrow", tone: "info" },
    ],
    signalsTitle: "Validation Progress",
    signals: [
      { label: "Attendance imported", value: "248 records", percent: 100, tone: "success" },
      { label: "Compensation matched", value: "246 / 248", percent: 99, tone: "success" },
      { label: "Benefits deductions", value: "236 / 248", percent: 95, tone: "warning" },
      { label: "Error queue cleared", value: "9 open", percent: 62, tone: "danger" },
    ],
    note: "Payroll drafts should only be locked after all source systems have been reconciled and the exception queue is below threshold.",
  },
  approval: {
    kicker: "Control gate",
    title: "Payroll Approval",
    subtitle: "Review exceptions, sign-off stages, variance justifications, and approval readiness before bank release.",
    primaryAction: "Approve Batch",
    secondaryAction: "Download Pack",
    icon: ClipboardCheck,
    metrics: [
      { label: "Approval stage", value: "5 / 7", meta: "Finance pending", tone: "warning" },
      { label: "Variance", value: "4.2%", meta: "Within threshold", tone: "success" },
      { label: "High-risk items", value: "5", meta: "Needs sign-off", tone: "danger" },
      { label: "Audit pack", value: "Ready", meta: "Generated 08:20", tone: "info" },
    ],
    focus: {
      title: "Finance and executive approvals are the remaining gates before payroll can be released.",
      detail: "High-value overtime and senior compensation changes need evidence attached before final approval.",
      stats: [["5", "Approved"], ["2", "Pending"], ["5", "Risk items"]],
    },
    tableTitle: "Approval Chain",
    tableAction: "Route",
    tableActionPath: "/payroll/approval",
    tableHeaders: ["Approver", "Role", "Items", "Submitted", "Status"],
    rows: [
      ["Mary Achieng", "Payroll Lead", "248", "08:05", "Approved", "success"],
      ["David Kariuki", "Branch Manager", "12", "08:18", "Approved", "success"],
      ["Grace Wanjiru", "Finance", "5", "08:30", "Pending", "warning"],
      ["Angela Njeri", "Executive", "2", "08:44", "Escalated", "danger"],
    ],
    actionsTitle: "Approval Tasks",
    actions: [
      { title: "Attach overtime justification", owner: "Branch Manager", due: "Today", tone: "danger" },
      { title: "Review finance variance note", owner: "Finance", due: "Today", tone: "warning" },
      { title: "Prepare release approval", owner: "Payroll Lead", due: "Tomorrow", tone: "info" },
    ],
    signalsTitle: "Approval Evidence",
    signals: [
      { label: "Variance evidence", value: "4 / 5 attached", percent: 80, tone: "warning" },
      { label: "Audit pack complete", value: "Ready", percent: 100, tone: "success" },
      { label: "Policy checks", value: "23 / 24", percent: 96, tone: "success" },
      { label: "Executive exceptions", value: "2 open", percent: 50, tone: "danger" },
    ],
    note: "Approval should preserve a clean audit trail for who reviewed, what changed, and which evidence supported final release.",
  },
  history: {
    kicker: "Payroll archive",
    title: "Payroll History",
    subtitle: "Review completed payroll runs, audit packets, variance trends, release dates, and statutory submission status.",
    primaryAction: "Download Archive",
    secondaryAction: "Filter",
    icon: ReceiptText,
    metrics: [
      { label: "Runs archived", value: "18", meta: "Last 12 months", tone: "success" },
      { label: "Total paid", value: "KES 208M", meta: "Rolling year", tone: "info" },
      { label: "Avg variance", value: "3.8%", meta: "Under target", tone: "success" },
      { label: "Open queries", value: "3", meta: "From June", tone: "warning" },
    ],
    focus: {
      title: "June payroll is fully paid but still has three employee query tickets to close.",
      detail: "Use history to compare run totals, retrieve audit packs, and confirm bank/tax completion evidence.",
      stats: [["18", "Runs"], ["3", "Queries"], ["100%", "Paid"]],
    },
    tableTitle: "Recent Runs",
    tableAction: "Open archive",
    tableActionPath: "/payroll/history",
    tableHeaders: ["Run", "Period", "Employees", "Paid", "Status"],
    rows: [
      ["June Regular", "Jun 2026", "244", "KES 17.8M", "Paid", "success"],
      ["May Regular", "May 2026", "241", "KES 17.2M", "Filed", "success"],
      ["April Regular", "Apr 2026", "239", "KES 16.4M", "Filed", "success"],
      ["March Adjustment", "Mar 2026", "14", "KES 420K", "Queried", "warning"],
    ],
    actionsTitle: "History Tasks",
    actions: [
      { title: "Close June payslip query", owner: "Payroll Support", due: "Today", tone: "warning" },
      { title: "Attach March adjustment note", owner: "Payroll Lead", due: "Friday", tone: "info" },
      { title: "Archive Q2 statutory receipts", owner: "Compliance", due: "Friday", tone: "success" },
    ],
    signalsTitle: "Archive Health",
    signals: [
      { label: "Audit packs stored", value: "18 / 18", percent: 100, tone: "success" },
      { label: "Bank receipts matched", value: "17 / 18", percent: 94, tone: "warning" },
      { label: "Tax receipts stored", value: "18 / 18", percent: 100, tone: "success" },
      { label: "Employee queries closed", value: "41 / 44", percent: 93, tone: "warning" },
    ],
    note: "Payroll history should remain searchable by run, branch, employee count, release evidence, statutory filing, and query status.",
  },
  tax: {
    kicker: "Statutory control",
    title: "Tax & Compliance",
    subtitle: "Track PAYE, pension, health, levy, audit flags, filing receipts, and statutory readiness before and after payroll release.",
    primaryAction: "Generate Filing",
    secondaryAction: "Export Report",
    icon: FileText,
    metrics: [
      { label: "PAYE due", value: "KES 3.4M", meta: "Draft total", tone: "info" },
      { label: "PIN coverage", value: "96%", meta: "9 missing", tone: "warning" },
      { label: "Statutory checks", value: "23 / 24", meta: "One warning", tone: "success" },
      { label: "Filing risk", value: "Medium", meta: "Resolve PIN gaps", tone: "danger" },
    ],
    focus: {
      title: "Compliance is blocked by missing employee tax PINs and one pension reconciliation warning.",
      detail: "Resolve missing identifiers before generating the final statutory filing pack for payment and receipts.",
      stats: [["KES 3.4M", "PAYE"], ["9", "PIN gaps"], ["1", "Warning"]],
    },
    tableTitle: "Statutory Items",
    tableAction: "Review",
    tableActionPath: "/payroll/tax-compliance",
    tableHeaders: ["Item", "Owner", "Amount", "Due", "Status"],
    rows: [
      ["PAYE", "Tax", "KES 3.4M", "9th", "Draft", "info"],
      ["Pension", "Benefits", "KES 1.2M", "10th", "Warning", "warning"],
      ["Health", "Compliance", "KES 680K", "9th", "Ready", "success"],
      ["Housing levy", "Finance", "KES 410K", "9th", "Ready", "success"],
    ],
    actionsTitle: "Compliance Tasks",
    actions: [
      { title: "Resolve missing tax PINs", owner: "Employee Records", due: "Today", tone: "danger" },
      { title: "Reconcile pension deduction warning", owner: "Benefits", due: "Today", tone: "warning" },
      { title: "Prepare filing receipts folder", owner: "Compliance", due: "Tomorrow", tone: "info" },
    ],
    signalsTitle: "Compliance Readiness",
    signals: [
      { label: "PAYE calculation", value: "Ready", percent: 100, tone: "success" },
      { label: "PIN coverage", value: "239 / 248", percent: 96, tone: "warning" },
      { label: "Pension reconciliation", value: "One warning", percent: 88, tone: "warning" },
      { label: "Receipt archive", value: "Prepared", percent: 92, tone: "success" },
    ],
    note: "Compliance needs calculation evidence, employee identifiers, filing receipts, and payment proof tied back to each payroll run.",
  },
  bank: {
    kicker: "Payment release",
    title: "Bank Integration",
    subtitle: "Validate employee bank details, payment batches, release files, approvals, bank responses, and failure retries.",
    primaryAction: "Generate Bank File",
    secondaryAction: "Sync Banks",
    icon: Landmark,
    metrics: [
      { label: "Bank-ready employees", value: "242", meta: "6 need review", tone: "warning" },
      { label: "Payment batches", value: "4", meta: "2 ready", tone: "info" },
      { label: "Total release", value: "KES 15.1M", meta: "Net pay", tone: "success" },
      { label: "Failed validations", value: "6", meta: "Account mismatch", tone: "danger" },
    ],
    focus: {
      title: "Bank release needs six account validations before the net-pay file can be approved.",
      detail: "Resolve account-name mismatches and split high-value payments into the approved bank batches.",
      stats: [["242", "Ready"], ["6", "Mismatch"], ["4", "Batches"]],
    },
    tableTitle: "Bank Batches",
    tableAction: "Open bank file",
    tableActionPath: "/payroll/bank-integration",
    tableHeaders: ["Batch", "Bank", "Employees", "Amount", "Status"],
    rows: [
      ["Batch A", "KCB", "112", "KES 6.8M", "Ready", "success"],
      ["Batch B", "Equity", "84", "KES 5.2M", "Review", "warning"],
      ["Batch C", "Co-op", "46", "KES 3.1M", "Ready", "success"],
      ["Corrections", "Mixed", "6", "KES 440K", "Blocked", "danger"],
    ],
    actionsTitle: "Bank Tasks",
    actions: [
      { title: "Fix six account-name mismatches", owner: "Payroll", due: "Today", tone: "danger" },
      { title: "Approve Equity batch split", owner: "Finance", due: "Today", tone: "warning" },
      { title: "Generate encrypted bank file", owner: "Payroll Lead", due: "Tomorrow", tone: "info" },
    ],
    signalsTitle: "Release Checks",
    signals: [
      { label: "Account validation", value: "242 / 248", percent: 98, tone: "warning" },
      { label: "Batch totals matched", value: "4 / 4", percent: 100, tone: "success" },
      { label: "Approval evidence", value: "2 / 3", percent: 67, tone: "danger" },
      { label: "Bank response parser", value: "Ready", percent: 100, tone: "success" },
    ],
    note: "Bank integration should protect the final release file with validation, approval evidence, response tracking, and retry handling.",
  },
  compensation: {
    kicker: "Pay data control",
    title: "Compensation Data",
    subtitle: "Maintain salary bands, allowances, deductions, benefits, one-time payments, and employee compensation snapshots.",
    primaryAction: "Add Adjustment",
    secondaryAction: "Import Changes",
    icon: CreditCard,
    metrics: [
      { label: "Comp records", value: "248", meta: "246 matched", tone: "success" },
      { label: "Salary changes", value: "18", meta: "July effective", tone: "info" },
      { label: "Allowance updates", value: "24", meta: "Field sales focus", tone: "warning" },
      { label: "Band exceptions", value: "2", meta: "Executive review", tone: "danger" },
    ],
    focus: {
      title: "Two compensation changes exceed approved bands and need executive review before payroll lock.",
      detail: "Salary, allowances, and deductions must reconcile to employee contracts and approval evidence.",
      stats: [["248", "Records"], ["42", "Changes"], ["2", "Exceptions"]],
    },
    tableTitle: "Compensation Changes",
    tableAction: "Review data",
    tableActionPath: "/payroll/compensation",
    tableHeaders: ["Change", "Owner", "Employees", "Impact", "Status"],
    rows: [
      ["Annual increments", "HR", "18", "KES 620K", "Ready", "success"],
      ["Field allowances", "Sales", "24", "KES 310K", "Review", "warning"],
      ["Executive exceptions", "Executive", "2", "KES 720K", "Escalated", "danger"],
      ["Benefit deductions", "Benefits", "236", "KES 880K", "Ready", "success"],
    ],
    actionsTitle: "Compensation Tasks",
    actions: [
      { title: "Attach band exception approval", owner: "Executive", due: "Today", tone: "danger" },
      { title: "Confirm field allowance list", owner: "Sales", due: "Today", tone: "warning" },
      { title: "Snapshot July compensation", owner: "Payroll", due: "Tomorrow", tone: "info" },
    ],
    signalsTitle: "Data Quality",
    signals: [
      { label: "Contract match", value: "246 / 248", percent: 99, tone: "success" },
      { label: "Allowance evidence", value: "21 / 24", percent: 88, tone: "warning" },
      { label: "Deduction mapping", value: "236 / 236", percent: 100, tone: "success" },
      { label: "Band exceptions cleared", value: "0 / 2", percent: 20, tone: "danger" },
    ],
    note: "Compensation data is the payroll source of truth and should be locked as a dated snapshot for every payroll run.",
  },
  gl: {
    kicker: "Finance posting",
    title: "Multi-Currency & GL Integration",
    subtitle: "Map payroll costs to currencies, departments, branches, accounts, cost centers, and finance posting journals.",
    primaryAction: "Post Journal",
    secondaryAction: "Recalculate FX",
    icon: Building2,
    metrics: [
      { label: "GL amount", value: "KES 18.6M", meta: "Balanced", tone: "success" },
      { label: "Cost centers", value: "14", meta: "2 unmapped", tone: "warning" },
      { label: "Currencies", value: "3", meta: "KES/USD/EUR", tone: "info" },
      { label: "Posting blocks", value: "2", meta: "Mapping needed", tone: "danger" },
    ],
    focus: {
      title: "GL posting is balanced but blocked by two unmapped cost centers.",
      detail: "Complete cost-center mapping and confirm FX rates before finance posts the payroll journal.",
      stats: [["KES 18.6M", "Journal"], ["14", "Centers"], ["2", "Blocks"]],
    },
    tableTitle: "Posting Lines",
    tableAction: "Open journal",
    tableActionPath: "/payroll/multi-currency-gl",
    tableHeaders: ["Line", "Account", "Cost center", "Amount", "Status"],
    rows: [
      ["Basic pay", "Staff costs", "Operations", "KES 12.4M", "Mapped", "success"],
      ["Benefits", "Benefits", "HR", "KES 2.6M", "Mapped", "success"],
      ["Overtime", "Staff costs", "Operations", "KES 1.6M", "Review", "warning"],
      ["Allowances", "Allowances", "Field Sales", "KES 920K", "Blocked", "danger"],
    ],
    actionsTitle: "GL Tasks",
    actions: [
      { title: "Map two allowance cost centers", owner: "Finance", due: "Today", tone: "danger" },
      { title: "Confirm overtime posting account", owner: "Payroll", due: "Today", tone: "warning" },
      { title: "Refresh FX rates", owner: "Finance", due: "Tomorrow", tone: "info" },
    ],
    signalsTitle: "Posting Readiness",
    signals: [
      { label: "Journal balanced", value: "KES 0 variance", percent: 100, tone: "success" },
      { label: "Cost centers mapped", value: "12 / 14", percent: 86, tone: "warning" },
      { label: "FX rates confirmed", value: "2 / 3", percent: 67, tone: "warning" },
      { label: "Posting blocks cleared", value: "0 / 2", percent: 20, tone: "danger" },
    ],
    note: "GL integration closes the loop between payroll approval and finance reporting by posting balanced, auditable journals.",
  },
};

function ActionIcon({ tone }: { tone: Tone }) {
  if (tone === "danger") {
    return <AlertTriangle aria-hidden="true" size={16} />;
  }

  if (tone === "success") {
    return <CheckCircle2 aria-hidden="true" size={16} />;
  }

  if (tone === "info") {
    return <RefreshCcw aria-hidden="true" size={16} />;
  }

  return <CalendarClock aria-hidden="true" size={16} />;
}

export default function PayrollWorkspace({ page }: { page: PayrollPageKey }) {
  const config = payrollConfigs[page];
  const Icon = config.icon;

  return (
    <div className="dashboard-page payroll-workspace">
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">{config.kicker}</div>
          <h1 className="page-title">{config.title}</h1>
          <p className="page-subtitle">{config.subtitle}</p>
        </div>

        <div className="action-row">
          <Link className="button button-secondary" to="/reports-analytics">
            <Download aria-hidden="true" size={15} />
            {config.secondaryAction}
          </Link>
          <Link className="button button-primary" to={page === "creation" ? "/payroll/creation" : "/payroll/approval"}>
            <Plus aria-hidden="true" size={15} />
            {config.primaryAction}
          </Link>
        </div>
      </div>

      <section className="metrics" aria-label={`${config.title} summary metrics`}>
        {config.metrics.map((metric) => (
          <div className="metric-cell" key={metric.label}>
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-meta">
              <span className={`pill pill-${metric.tone}`}>{metric.meta}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="payroll-focus-band" aria-label={`${config.title} current focus`}>
        <div className="payroll-focus-copy">
          <span className="payroll-focus-icon">
            <Icon aria-hidden="true" size={20} />
          </span>
          <div>
            <div className="eyebrow">Current focus</div>
            <h2>{config.focus.title}</h2>
            <p>{config.focus.detail}</p>
          </div>
        </div>
        <div className="payroll-focus-stats">
          {config.focus.stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">{config.tableTitle}</h3>
            <Link className="panel-action" to={config.tableActionPath}>{config.tableAction}</Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {config.tableHeaders.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {config.rows.map(([first, second, third, fourth, status, tone]) => (
                  <tr key={`${first}-${second}`}>
                    <td>{first}</td>
                    <td>{second}</td>
                    <td>{third}</td>
                    <td>{fourth}</td>
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
            <h3 className="panel-title">{config.actionsTitle}</h3>
            <Link className="panel-action" to="/payroll/approval">Assign</Link>
          </div>
          <div className="panel-body">
            <ul className="payroll-action-list">
              {config.actions.map((item) => (
                <li className="payroll-action-item" key={item.title}>
                  <span className={`payroll-action-icon payroll-action-icon-${item.tone}`}>
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
      </div>

      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">{config.signalsTitle}</h3>
            <Link className="panel-action" to={config.tableActionPath}>Review checks</Link>
          </div>
          <div className="panel-body">
            <ul className="run-list">
              {config.signals.map((signal) => (
                <li className="run-item" key={signal.label}>
                  <div className="payroll-progress-row">
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

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Audit Notes</h3>
            <Link className="panel-action" to="/reports-analytics">Evidence</Link>
          </div>
          <div className="panel-body">
            <div className="note payroll-note">
              <ShieldCheck aria-hidden="true" size={17} />
              <span>{config.note}</span>
            </div>
            <div className="payroll-control-grid">
              <div className="payroll-control-cell">
                <FileCheck2 aria-hidden="true" size={17} />
                <span>Evidence pack</span>
                <strong>Ready</strong>
              </div>
              <div className="payroll-control-cell">
                <Banknote aria-hidden="true" size={17} />
                <span>Finance check</span>
                <strong>Open</strong>
              </div>
              <div className="payroll-control-cell">
                <Send aria-hidden="true" size={17} />
                <span>Next handoff</span>
                <strong>Approval</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
