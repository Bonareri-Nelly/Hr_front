import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  Download,
  FileText,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCog,
} from "lucide-react";

type Tone = "success" | "warning" | "danger" | "info";

const profileMetrics: Array<{ label: string; value: string; meta: string; tone: Tone }> = [
  { label: "Profile completion", value: "96%", meta: "1 document pending", tone: "warning" },
  { label: "Access level", value: "Admin", meta: "HR + Payroll", tone: "success" },
  { label: "Open approvals", value: "12", meta: "5 due today", tone: "danger" },
  { label: "Last review", value: "Jul 2026", meta: "Compliant", tone: "success" },
];

const accessRows: Array<[string, string, string, Tone]> = [
  ["Payroll Administration", "Create runs, approve deductions, publish payslips", "Active", "success"],
  ["Employee Records", "View and update staff records across assigned branches", "Active", "success"],
  ["Disciplinary Management", "Open cases, assign hearings, publish outcomes", "Active", "success"],
  ["Finance Exports", "Download bank and GL files", "Review", "warning"],
];

const documents: Array<[string, string, string, Tone]> = [
  ["National ID", "Verified by HR Operations", "Verified", "success"],
  ["KRA PIN", "Matched to payroll profile", "Verified", "success"],
  ["Employment Contract", "Signed 04 Jan 2024", "Current", "info"],
  ["Conflict Disclosure", "Annual refresh required", "Pending", "warning"],
];

const activity = [
  ["Changed payroll approval limit", "Security audit recorded the role update"],
  ["Approved branch payroll exceptions", "Mombasa and Kisumu exception queues cleared"],
  ["Updated emergency contact", "Employee profile sync completed"],
];

export default function UserProfilePage() {
  return (
    <div className="dashboard-page profile-page">
      <div className="profile-hero panel">
        <div className="profile-identity">
          <div className="profile-avatar">AN</div>
          <div>
            <div className="page-kicker">User profile</div>
            <h1 className="page-title">Angela Njeri</h1>
            <p className="page-subtitle">
              Payroll Admin, HR Operations. Responsible for payroll execution, employee records, compliance review,
              and branch approval support across Nairobi HQ.
            </p>
            <div className="profile-contact-row" aria-label="Contact details">
              <span><Mail aria-hidden="true" size={15} /> angela.njeri@nexus.co.ke</span>
              <span><Phone aria-hidden="true" size={15} /> +254 711 240 816</span>
              <span><MapPin aria-hidden="true" size={15} /> Nairobi HQ</span>
            </div>
          </div>
        </div>
        <div className="action-row">
          <button className="button button-secondary" type="button">
            <Download aria-hidden="true" size={15} />
            Export Profile
          </button>
          <button className="button button-primary" type="button">
            <UserCog aria-hidden="true" size={15} />
            Edit Access
          </button>
        </div>
      </div>

      <section className="metrics" aria-label="User profile summary">
        {profileMetrics.map((metric) => (
          <div className="metric-cell" key={metric.label}>
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-meta"><span className={`pill pill-${metric.tone}`}>{metric.meta}</span></div>
          </div>
        ))}
      </section>

      <div className="grid-main">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Access & Permissions</h3>
            <button className="panel-action" type="button">Review access</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Permission</th>
                  <th>Scope</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {accessRows.map(([permission, scope, status, tone]) => (
                  <tr key={permission}>
                    <td>{permission}</td>
                    <td>{scope}</td>
                    <td><span className={`pill pill-${tone}`}>{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Employment Snapshot</h3>
            <button className="panel-action" type="button">Open record</button>
          </div>
          <div className="panel-body profile-snapshot-list">
            <div className="profile-snapshot-item">
              <BriefcaseBusiness aria-hidden="true" size={18} />
              <div><span>Department</span><strong>HR Operations</strong></div>
            </div>
            <div className="profile-snapshot-item">
              <BadgeCheck aria-hidden="true" size={18} />
              <div><span>Role</span><strong>Payroll Admin</strong></div>
            </div>
            <div className="profile-snapshot-item">
              <CalendarCheck aria-hidden="true" size={18} />
              <div><span>Start date</span><strong>04 Jan 2024</strong></div>
            </div>
            <div className="profile-snapshot-item">
              <ShieldCheck aria-hidden="true" size={18} />
              <div><span>Manager</span><strong>David Kamau</strong></div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid-2col">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Documents & Compliance</h3>
            <button className="panel-action" type="button">Upload</button>
          </div>
          <div className="panel-body">
            <ul className="profile-document-list">
              {documents.map(([title, meta, status, tone]) => (
                <li className="profile-document-item" key={title}>
                  <FileText aria-hidden="true" size={18} />
                  <div>
                    <div className="activity-title">{title}</div>
                    <div className="activity-meta">{meta}</div>
                  </div>
                  <span className={`pill pill-${tone}`}>{status}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Security Activity</h3>
            <button className="panel-action" type="button">Audit log</button>
          </div>
          <div className="panel-body">
            <div className="profile-security-note note">
              <KeyRound aria-hidden="true" size={17} />
              <span>Multi-factor authentication is active. Password was last changed 18 days ago.</span>
            </div>
            <ul className="activity-list profile-activity-list">
              {activity.map(([title, meta]) => (
                <li className="activity-item" key={title}>
                  <span className="activity-dot" />
                  <div>
                    <div className="activity-title">{title}</div>
                    <div className="activity-meta">{meta}</div>
                  </div>
                  <span className="pill pill-info">Now</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
