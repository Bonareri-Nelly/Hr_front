import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actions, resources, type ApiRecord } from "../../../services/api/resources";

const text = (item: ApiRecord, field: string) => String(item[field] ?? "—");
const money = (value: unknown) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(Number(value ?? 0));

export default function ContractManagementPage() {
  const client = useQueryClient();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const contracts = useQuery({ queryKey: ["contracts"], queryFn: () => resources.contracts.list() });
  const expiring = useQuery({ queryKey: ["contracts", "expiring"], queryFn: async () => (await actions.expiringContracts()).data as ApiRecord[] });
  const renew = useMutation({ mutationFn: ({ id, endDate, salary }: { id: number; endDate: string; salary: string }) => actions.renewContract(id, { new_start_date: new Date().toISOString().slice(0, 10), new_end_date: endDate || null, new_salary: salary }), onSuccess: () => { setNotice("Contract renewed."); client.invalidateQueries({ queryKey: ["contracts"] }); } });
  const terminate = useMutation({ mutationFn: (id: number) => actions.terminateContract(id, { termination_type: "RESIGNATION", termination_date: new Date().toISOString().slice(0, 10), reason: "Recorded from contract management", notice_period_days: 0, final_settlement_required: true }), onSuccess: () => { setNotice("Contract terminated."); client.invalidateQueries({ queryKey: ["contracts"] }); } });
  const rows = useMemo(() => (contracts.data ?? []).filter((item) => `${text(item, "contract_number")} ${text(item, "employee_name")} ${text(item, "status")}`.toLowerCase().includes(query.toLowerCase())), [contracts.data, query]);
  const active = (contracts.data ?? []).filter((item) => text(item, "status").toLowerCase() === "active").length;

  return <div className="dashboard-page" style={{ display: "grid", gap: 18 }}>
    <div><h1 className="page-title">Contract Management</h1><p className="page-subtitle">Contracts are loaded directly from the employment-contract API.</p></div>
    {(contracts.error || expiring.error || renew.error || terminate.error) && <div className="alert alert-error">{(contracts.error ?? expiring.error ?? renew.error ?? terminate.error)?.message}</div>}
    {notice && <div className="alert alert-success">{notice}</div>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}><Metric label="Contracts" value={(contracts.data ?? []).length} /><Metric label="Active" value={active} /><Metric label="Expiring soon" value={expiring.data?.length ?? 0} /></div>
    <section className="panel"><div className="panel-header" style={{ display: "flex", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}><h2 className="panel-title">Employment contracts</h2><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee or contract" /></div><div className="panel-body table-wrap"><table className="table"><thead><tr><th>Contract</th><th>Employee</th><th>Type</th><th>Period</th><th>Salary</th><th>Status</th><th>Actions</th></tr></thead><tbody>{contracts.isLoading ? <tr><td colSpan={7}>Loading contracts…</td></tr> : rows.length ? rows.map((item) => <tr key={item.id}><td>{text(item, "contract_number")}</td><td>{text(item, "employee_name")}</td><td>{text(item, "contract_type")}</td><td>{text(item, "start_date")} – {text(item, "end_date")}</td><td>{money(item.basic_salary)}</td><td>{text(item, "status")}</td><td style={{ display: "flex", gap: 6 }}><button className="button button-secondary" disabled={renew.isPending} onClick={() => { const endDate = window.prompt("New end date (YYYY-MM-DD; leave blank for open-ended):", text(item, "end_date").replace("—", "")); const salary = window.prompt("New monthly salary:", String(item.basic_salary ?? "")); if (salary !== null && endDate !== null) renew.mutate({ id: Number(item.id), endDate, salary }); }}>Renew</button><button className="button button-secondary" disabled={terminate.isPending} onClick={() => { if (window.confirm("Terminate this contract?")) terminate.mutate(Number(item.id)); }}>Terminate</button></td></tr>) : <tr><td colSpan={7}>No contracts found.</td></tr>}</tbody></table></div></section>
  </div>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="summary-card"><div style={{ color: "var(--text-secondary)", fontSize: ".75rem" }}>{label}</div><strong style={{ fontSize: "1.4rem" }}>{value}</strong></div>; }
