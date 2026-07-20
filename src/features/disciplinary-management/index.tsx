import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { resources, type ApiRecord } from "../../services/api/resources";

const value = (record: ApiRecord, key: string) => String(record[key] ?? "—");

export default function DisciplinaryManagement() {
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const cases = useQuery({ queryKey: ["disciplinary-cases"], queryFn: () => resources.disciplinaryCases.list() });
  const records = useMemo(() => (cases.data ?? []).filter((item) => {
    const matchesStatus = status === "All" || value(item, "status").toLowerCase() === status.toLowerCase();
    const searchable = `${value(item, "id")} ${value(item, "employee_name")} ${value(item, "description")} ${value(item, "severity")}`.toLowerCase();
    return matchesStatus && searchable.includes(query.toLowerCase());
  }), [cases.data, query, status]);
  const open = (cases.data ?? []).filter((item) => !["resolved", "closed"].includes(value(item, "status").toLowerCase())).length;

  return <div className="dashboard-page" style={{ display: "grid", gap: 16 }}>
    <div><h1 className="page-title">Disciplinary Management</h1><p className="page-subtitle">Live HR case register from the disciplinary-case API.</p></div>
    {cases.error && <div className="alert alert-error">{cases.error.message}</div>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}><Metric label="All HR cases" value={(cases.data ?? []).length} /><Metric label="Open cases" value={open} /><Metric label="Resolved cases" value={(cases.data ?? []).length - open} /></div>
    <section className="panel"><div className="panel-header" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}><h2 className="panel-title">Case register</h2><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Open</option><option>Under Review</option><option>Resolved</option><option>Closed</option></select><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cases" /></div></div><div className="panel-body table-wrap"><table className="table"><thead><tr><th>Case</th><th>Employee</th><th>Incident date</th><th>Severity</th><th>Status</th><th>Description</th></tr></thead><tbody>{cases.isLoading ? <tr><td colSpan={6}>Loading cases…</td></tr> : records.length ? records.map((item) => <tr key={item.id}><td>{value(item, "id")}</td><td>{value(item, "employee_name")}</td><td>{value(item, "incident_date")}</td><td>{value(item, "severity")}</td><td>{value(item, "status")}</td><td>{value(item, "description")}</td></tr>) : <tr><td colSpan={6}>No disciplinary cases match this filter.</td></tr>}</tbody></table></div></section>
  </div>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="summary-card"><div style={{ color: "var(--text-secondary)", fontSize: ".75rem" }}>{label}</div><strong style={{ fontSize: "1.35rem" }}>{value}</strong></div>; }
