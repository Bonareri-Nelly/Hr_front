import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="sidebar-brand login-brand">
          <div className="brand-mark">N</div>
          <div>
            <div className="brand-name login-brand-name">Nexus</div>
            <div className="brand-subtitle">HR &amp; Payroll</div>
          </div>
        </div>

        <h1 className="page-title">Executive payroll workspace</h1>
        <p className="page-subtitle">
          Enter the reusable Nexus layout system for branch operations, approvals, and payroll command workflows.
        </p>

        <Link
          to="/dashboard"
          className="button button-primary login-action"
        >
          Enter Dashboard
        </Link>
      </div>
    </div>
  );
}
