import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../../services/api/api";

type Review = { id: number; employee: number; employee_name: string; cycle_name?: string; overall_score?: number | null; overall_rating?: string | null; manager_comments?: string; employee_comments?: string; status: string; updated_at?: string };
type Goal = { id: number; title: string; description?: string; status: string; weight?: number; progress_percentage?: number; target_date?: string; cycle_name?: string };
const list = <T,>(value: T[] | { results?: T[] }) => Array.isArray(value) ? value : value.results ?? [];
const currentEmployeeId = () => { try { const saved = JSON.parse(localStorage.getItem("current_user") ?? localStorage.getItem("user") ?? "{}"); return saved.employee_id ?? localStorage.getItem("employee_id"); } catch { return localStorage.getItem("employee_id"); } };

export default function MyPerformancePage() {
  const employeeId = currentEmployeeId();
  const reviewsQuery = useQuery({ queryKey: ["my-performance-reviews", employeeId], enabled: Boolean(employeeId), queryFn: async () => list((await api.get<Review[] | { results?: Review[] }>("/performance/reviews/", { params: { employee: employeeId } })).data) });
  const goalsQuery = useQuery({ queryKey: ["my-performance-goals", employeeId], enabled: Boolean(employeeId), queryFn: async () => list((await api.get<Goal[] | { results?: Goal[] }>("/performance/goals/", { params: { employee: employeeId } })).data) });
  const review = reviewsQuery.data?.[0];
  const goals = goalsQuery.data ?? [];
  const score = Number(review?.overall_score ?? 0);
  const overallProgress = useMemo(() => goals.length ? goals.reduce((sum, goal) => sum + Number(goal.progress_percentage ?? 0), 0) / goals.length : 0, [goals]);
  if (!employeeId) return <div className="dashboard-page"><h1 className="page-title">My performance</h1><div className="alert alert-error">Your employee profile is not linked to this account. Ask HR to link your user account.</div></div>;
  return <div className="dashboard-page"><header><p className="page-kicker">Employee self-service</p><h1 className="page-title">My performance</h1><p className="page-subtitle">Your reviews and goals are loaded from the performance service.</p></header><section className="summary-grid"><article className="summary-card"><span>Current rating</span><strong>{score ? score.toFixed(1) : "—"}</strong><small>{review?.overall_rating ?? "Awaiting review"}</small></article><article className="summary-card"><span>Goal progress</span><strong>{overallProgress.toFixed(0)}%</strong><small>{goals.length} goals</small></article><article className="summary-card"><span>Review status</span><strong>{review?.status?.replaceAll("_", " ") ?? "No active review"}</strong><small>{review?.cycle_name ?? ""}</small></article></section><section className="panel"><div className="panel-header"><h2 className="panel-title">Goals & check-ins</h2></div><div className="panel-body table-wrap"><table className="table"><thead><tr><th>Goal</th><th>Target date</th><th>Status</th><th>Progress</th></tr></thead><tbody>{goalsQuery.isLoading ? <tr><td colSpan={4}>Loading goals…</td></tr> : goals.length ? goals.map((goal) => <tr key={goal.id}><td><strong>{goal.title}</strong><div>{goal.description}</div></td><td>{goal.target_date ?? "—"}</td><td>{goal.status.replaceAll("_", " ")}</td><td>{Number(goal.progress_percentage ?? 0).toFixed(0)}%</td></tr>) : <tr><td colSpan={4}>No performance goals have been assigned.</td></tr>}</tbody></table></div></section><section className="panel"><div className="panel-header"><h2 className="panel-title">Manager feedback</h2></div><div className="panel-body"><p>{review?.manager_comments || "No manager feedback has been published for the current review."}</p><p className="page-subtitle">Your comments: {review?.employee_comments || "None submitted."}</p></div></section></div>;
}
