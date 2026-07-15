import { useMemo, useState } from "react";
import { leaveReportRecords } from "../data/leaveReportMockData";

type Props = { open: boolean; onClose: () => void };
const options = (values: string[]) => [...new Set(values)];

export default function LeaveReportsAuditModal({ open, onClose }: Props) {
  const [filters, setFilters] = useState({ employee: "", department: "All", branch: "All", employmentType: "All", leaveType: "All", status: "All", gender: "All", manager: "All", startDate: "", endDate: "" });
  const records = useMemo(() => leaveReportRecords.filter((record) =>
    (!filters.employee || record.employee.toLowerCase().includes(filters.employee.toLowerCase())) &&
    (filters.department === "All" || record.department === filters.department) && (filters.branch === "All" || record.branch === filters.branch) &&
    (filters.employmentType === "All" || record.employmentType === filters.employmentType) && (filters.leaveType === "All" || record.leaveType === filters.leaveType) &&
    (filters.status === "All" || record.status === filters.status) && (filters.gender === "All" || record.gender === filters.gender) &&
    (filters.manager === "All" || record.manager === filters.manager) && (!filters.startDate || record.startDate >= filters.startDate) && (!filters.endDate || record.endDate <= filters.endDate)
  ), [filters]);
  if (!open) return null;
  const totalDays = records.reduce((total, record) => total + record.days, 0);
  const exportReport = (format: string) => alert(`${format} export prepared for ${records.length} leave request(s).`);
  const select = (label: string, key: keyof typeof filters, values: string[]) => <label style={labelStyle}>{label}<select style={fieldStyle} value={filters[key]} onChange={(event) => setFilters({ ...filters, [key]: event.target.value })}><option>All</option>{options(values).map((value) => <option key={value}>{value}</option>)}</select></label>;
  return <div onClick={onClose} style={overlayStyle}><div className="panel" onClick={(event) => event.stopPropagation()} style={modalStyle}>
    <div className="panel-header"><h2 className="panel-title">Reports &amp; Audit</h2><button className="button button-secondary" onClick={onClose}>✕</button></div>
    <div className="panel-body" style={{ display: "grid", gap: 16 }}>
      <div style={filterGrid}><label style={labelStyle}>Employee<input style={fieldStyle} placeholder="Search employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} /></label>{select("Department", "department", leaveReportRecords.map((r) => r.department))}{select("Branch", "branch", leaveReportRecords.map((r) => r.branch))}{select("Employment Type", "employmentType", leaveReportRecords.map((r) => r.employmentType))}{select("Leave Type", "leaveType", leaveReportRecords.map((r) => r.leaveType))}{select("Leave Status", "status", ["Pending", "Approved", "Rejected", "Cancelled"])}{select("Gender", "gender", ["Male", "Female"])}{select("Manager", "manager", leaveReportRecords.map((r) => r.manager))}<label style={labelStyle}>Leave Starts From<input type="date" style={fieldStyle} value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value })} /></label><label style={labelStyle}>Leave Ends By<input type="date" style={fieldStyle} value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value })} /></label></div>
      <div style={summaryGrid}>{[["Total Requests", records.length], ["Approved Leaves", records.filter((r) => r.status === "Approved").length], ["Pending Approvals", records.filter((r) => r.status === "Pending").length], ["Rejected Requests", records.filter((r) => r.status === "Rejected").length], ["Currently on Leave", records.filter((r) => r.status === "Approved" && r.startDate <= "2026-07-14" && r.endDate >= "2026-07-14").length], ["Total Leave Days", totalDays]].map(([label, value]) => <div key={String(label)} className="summary-card"><div style={{ fontSize: ".7rem", color: "var(--text-secondary)" }}>{label}</div><strong style={{ fontSize: "1.1rem" }}>{value}</strong></div>)}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button className="button button-secondary" onClick={() => exportReport("Excel")}>Export to Excel</button><button className="button button-secondary" onClick={() => exportReport("PDF")}>Export to PDF</button><button className="button button-secondary" onClick={() => window.print()}>Print Report</button></div>
      <div className="table-wrap"><table className="table"><thead><tr><th>Employee</th><th>Department</th><th>Leave Type</th><th>Leave Dates</th><th>Days</th><th>Status</th><th>Approver</th><th>Date Approved</th></tr></thead><tbody>{records.map((r) => <tr key={r.id}><td>{r.employee}</td><td>{r.department}</td><td>{r.leaveType}</td><td>{r.startDate} – {r.endDate}</td><td>{r.days}</td><td>{r.status}</td><td>{r.approver}</td><td>{r.dateApproved ?? "—"}</td></tr>)}</tbody></table></div>
    </div><div style={footerStyle}><button className="button button-secondary" onClick={onClose}>Close</button></div>
  </div></div>;
}
const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, zIndex: 1200, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)" };
const modalStyle: React.CSSProperties = { width: "100%", maxWidth: 1200, maxHeight: "92vh", overflowY: "auto" };
const filterGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 };
const summaryGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 };
const labelStyle: React.CSSProperties = { display: "grid", gap: 5, fontSize: ".75rem", fontWeight: 600 };
const fieldStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface)", color: "var(--ink)" };
const footerStyle: React.CSSProperties = { display: "flex", justifyContent: "flex-end", padding: "14px 18px", borderTop: "1px solid var(--border-subtle)" };
