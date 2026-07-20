import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actions, resources, type ApiRecord } from "../../../services/api/resources";

const field = (item: ApiRecord, name: string) => String(item[name] ?? "—");

export default function PerformanceOversightPage() {
  const client = useQueryClient();
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("All");
  const cycles = useQuery({ queryKey: ["performance", "cycles"], queryFn: () => resources.performanceCycles.list() });
  const reviews = useQuery({ queryKey: ["performance", "reviews"], queryFn: () => resources.performanceReviews.list() });
  const goals = useQuery({ queryKey: ["performance", "goals"], queryFn: () => resources.performanceGoals.list() });
  const finalize = useMutation({ mutationFn: (id: number) => actions.finalizePerformanceReview(id), onSuccess: () => { setMessage("Performance review finalized."); client.invalidateQueries({ queryKey: ["performance", "reviews"] }); } });
  const visibleReviews = useMemo(() => (reviews.data ?? []).filter((review) => filter === "All" || field(review, "status").toLowerCase() === filter.toLowerCase()), [reviews.data, filter]);
  const pending = (reviews.data ?? []).filter((review) => !["finalized", "completed"].includes(field(review, "status").toLowerCase())).length;

  return <div className="dashboard-page" style={{ display: "grid", gap: 18 }}>
    <div><h1 className="page-title">Performance Oversight</h1><p className="page-subtitle">Live performance cycles, goals, and reviews from the performance API.</p></div>
    {(cycles.error || reviews.error || goals.error || finalize.error) && <div className="alert alert-error">{(cycles.error ?? reviews.error ?? goals.error ?? finalize.error)?.message}</div>}
    {message && <div className="alert alert-success">{message}</div>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}><Metric label="Review cycles" value={(cycles.data ?? []).length} /><Metric label="Reviews" value={(reviews.data ?? []).length} /><Metric label="Needs action" value={pending} /><Metric label="Goals" value={(goals.data ?? []).length} /></div>
    <section className="panel"><div className="panel-header" style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}><h2 className="panel-title">Performance reviews</h2><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Draft</option><option>Submitted</option><option>Manager Approved</option><option>HR Approved</option><option>Finalized</option></select></div><div className="panel-body table-wrap"><table className="table"><thead><tr><th>Employee</th><th>Cycle</th><th>Period</th><th>Rating</th><th>Status</th><th>Action</th></tr></thead><tbody>{reviews.isLoading ? <tr><td colSpan={6}>Loading performance reviews…</td></tr> : visibleReviews.length ? visibleReviews.map((review) => <tr key={review.id}><td>{field(review, "employee_name")}</td><td>{field(review, "cycle_name")}</td><td>{field(review, "review_period_start")} – {field(review, "review_period_end")}</td><td>{field(review, "overall_rating")}</td><td>{field(review, "status")}</td><td><button className="button button-secondary" disabled={finalize.isPending || ["finalized", "completed"].includes(field(review, "status").toLowerCase())} onClick={() => finalize.mutate(Number(review.id))}>Finalize</button></td></tr>) : <tr><td colSpan={6}>No performance reviews match this status.</td></tr>}</tbody></table></div></section>
    <section className="panel"><div className="panel-header"><h2 className="panel-title">Goals</h2></div><div className="panel-body table-wrap"><table className="table"><thead><tr><th>Employee</th><th>Goal</th><th>Cycle</th><th>Target date</th><th>Status</th></tr></thead><tbody>{goals.isLoading ? <tr><td colSpan={5}>Loading goals…</td></tr> : goals.data?.length ? goals.data.map((goal) => <tr key={goal.id}><td>{field(goal, "employee_name")}</td><td>{field(goal, "title")}</td><td>{field(goal, "cycle_name")}</td><td>{field(goal, "target_date")}</td><td>{field(goal, "status")}</td></tr>) : <tr><td colSpan={5}>No goals found.</td></tr>}</tbody></table></div></section>
  </div>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="summary-card"><div style={{ color: "var(--text-secondary)", fontSize: ".75rem" }}>{label}</div><strong style={{ fontSize: "1.4rem" }}>{value}</strong></div>; }
