import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { resources, type ApiRecord } from "../../../services/api/resources";

type CaseRecord = ApiRecord & {
  employee_name?: string;
  description?: string;
  severity?: string;
  status?: string;
  incident_date?: string;
  hearing_date?: string | null;
};

const label = (value?: string) => (value || "").replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase());

export default function DisciplinaryCasesDashboard() {
  const client = useQueryClient();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const cases = useQuery({ queryKey: ["disciplinary-cases"], queryFn: () => resources.disciplinaryCases.list() as Promise<CaseRecord[]> });
  const createCase = useMutation({
    mutationFn: (payload: Record<string, unknown>) => resources.disciplinaryCases.create(payload as never),
    onSuccess: () => { client.invalidateQueries({ queryKey: ["disciplinary-cases"] }); setOpen(false); },
  });
  const visible = useMemo(() => (cases.data ?? []).filter((item) => `${item.employee_name ?? ""} ${item.description ?? ""} ${item.status ?? ""}`.toLowerCase().includes(query.toLowerCase())), [cases.data, query]);

  if (cases.isLoading) return <div className="dashboard-page">Loading disciplinary cases…</div>;
  if (cases.error) return <div className="dashboard-page">Unable to load disciplinary cases.</div>;

  return <div className="dashboard-page" style={{ display: "grid", gap: 18 }}>
    <header className="dashboard-heading"><div><p className="page-kicker">Employee relations</p><h1 className="page-title">Disciplinary cases</h1><p className="page-subtitle">Live cases from the HR operations database.</p></div><button className="button button-primary" onClick={() => setOpen(true)}><Plus size={16} /> New case</button></header>
    <section className="panel"><div className="panel-body"><label className="field-group"><span>Search cases</span><div className="input-shell"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Employee, status, or incident" /></div></label></div></section>
    <section className="panel"><div className="panel-body table-wrap"><table className="table"><thead><tr><th>Employee</th><th>Incident</th><th>Severity</th><th>Status</th><th>Date</th><th>Hearing</th></tr></thead><tbody>{visible.length ? visible.map((item) => <tr key={item.id}><td>{item.employee_name || `Employee #${item.employee}`}</td><td>{item.description}</td><td>{label(item.severity)}</td><td>{label(item.status)}</td><td>{item.incident_date || "—"}</td><td>{item.hearing_date || "—"}</td></tr>) : <tr><td colSpan={6}>No disciplinary cases found.</td></tr>}</tbody></table></div></section>
    {open && <CreateCase onClose={() => setOpen(false)} onCreate={(payload) => createCase.mutate(payload)} pending={createCase.isPending} error={createCase.error instanceof Error ? createCase.error.message : ""} />}
  </div>;
}

function CreateCase({ onClose, onCreate, pending, error }: { onClose: () => void; onCreate: (payload: Record<string, unknown>) => void; pending: boolean; error: string }) {
  const [form, setForm] = useState({ employee: "", incident_date: new Date().toISOString().slice(0, 10), description: "", severity: "MINOR" });
  return <div className="modal-backdrop"><form className="panel" onSubmit={(event) => { event.preventDefault(); onCreate({ ...form, employee: Number(form.employee) }); }} style={{ width: "min(560px, 92vw)" }}><div className="panel-header"><h2 className="panel-title">Create disciplinary case</h2></div><div className="panel-body" style={{ display: "grid", gap: 12 }}><label className="field-group"><span>Employee ID</span><input required type="number" value={form.employee} onChange={(event) => setForm({ ...form, employee: event.target.value })} /></label><label className="field-group"><span>Incident date</span><input required type="date" value={form.incident_date} onChange={(event) => setForm({ ...form, incident_date: event.target.value })} /></label><label className="field-group"><span>Severity</span><select value={form.severity} onChange={(event) => setForm({ ...form, severity: event.target.value })}><option value="MINOR">Minor</option><option value="MODERATE">Moderate</option><option value="MAJOR">Major</option><option value="GROSS_MISCONDUCT">Gross misconduct</option></select></label><label className="field-group"><span>Description</span><textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>{error && <p className="alert alert-error">{error}</p>}<div className="action-row"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button disabled={pending} className="button button-primary">{pending ? "Saving…" : "Create case"}</button></div></div></form></div>;
}
