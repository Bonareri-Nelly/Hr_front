import { CalendarDays, Eye, Plus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageChatbotWidget from "../../../../components/shared/PageChatbotWidget";
import { resources, type ApiRecord } from "../../../../services/api/resources";

type CurrentUser = {
  id: number;
  username: string;
  employee_id?: number;
  branch_name?: string;
};

const getCurrentUser = (): CurrentUser | null => {
  try {
    return JSON.parse(localStorage.getItem("current_user") ?? localStorage.getItem("user") ?? "{}");
  } catch {
    return null;
  }
};

export default function MyBenefitsPage() {
  const client = useQueryClient();
  const user = getCurrentUser();
  const employeeId = user?.employee_id;

  const [selectedBenefit, setSelectedBenefit] = useState<ApiRecord | null>(null);
  // FIX: enrollOpen starts false; the Enroll button opens the modal (was previously disabled when enrollOpen is false)
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const plans = useQuery({
    queryKey: ["benefit-plans"],
    queryFn: () => resources.allowances.list(),
    select: (data: ApiRecord[]) => data.filter((p) => p.type === "benefit" || p.category === "benefit" || p.is_benefit) as ApiRecord[],
  });

  // FIX: Scope enrollments to the logged-in employee
  const enrollments = useQuery({
    queryKey: ["employee-benefits", employeeId],
    queryFn: () => {
      if (!employeeId) return Promise.resolve([]);
      return resources.employeeComponents.list({ employee: employeeId });
    },
    enabled: Boolean(employeeId),
  });

  const enrollMutation = useMutation({
    mutationFn: async (planId: number) => {
      if (!employeeId) throw new Error("Employee profile not linked.");
      return resources.employeeComponents.create({ employee: employeeId, component: planId, status: "pending" });
    },
    onSuccess: () => {
      setNotice("Enrollment submitted for HR Admin review.");
      setEnrollOpen(false);
      setSelectedPlanId("");
      setEnrolling(false);
      client.invalidateQueries({ queryKey: ["employee-benefits"] });
    },
    onError: (err: Error) => {
      setNotice(err.message);
      setEnrolling(false);
    },
  });

  const benefits = (enrollments.data ?? []) as ApiRecord[];
  const planList = (plans.data ?? []) as ApiRecord[];

  // Guard: no employee profile linked
  if (!employeeId) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-heading">
          <div>
            <p className="page-kicker">Employee self-service</p>
            <h1 className="page-title">My Benefits</h1>
          </div>
        </div>
        <div className="alert alert-error">
          Your account is not linked to an employee profile. Ask HR to link your user account before you can view benefits.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="page-kicker">Employee self-service</p>
          <h1 className="page-title">My Benefits</h1>
          <p className="page-subtitle">View enrolled plans, coverage, dependents and open-enrollment options connected to Benefits Management.</p>
        </div>
        <div className="action-row">
          {/* FIX: Button now correctly opens the modal (removed the broken disabled={!enrollOpen} condition) */}
          <button className="button button-primary" onClick={() => setEnrollOpen(true)}>
            <Plus size={15} aria-hidden="true" /> Enroll
          </button>
        </div>
      </div>

      <div className="note" style={{ background: "var(--info-bg)", color: "var(--info)", border: "1px solid var(--info)", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem" }}>
        <CalendarDays size={16} /> Open enrollment is active. Available plans can be submitted for HR review.
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}

      {/* Enroll Modal */}
      {enrollOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="module-modal" style={{ maxWidth: "520px" }}>
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Open enrollment</div>
                <h2>Enroll in a plan</h2>
              </div>
              <button className="panel-action" onClick={() => { setEnrollOpen(false); setSelectedPlanId(""); }}>Close</button>
            </div>
            {plans.isLoading ? (
              <div className="panel-body" style={{ textAlign: "center", padding: "32px" }}>
                <LoaderCircle className="mx-auto animate-spin" />
                <p className="page-subtitle" style={{ marginTop: "12px" }}>Loading benefit plans…</p>
              </div>
            ) : planList.length === 0 ? (
              <div className="panel-body" style={{ textAlign: "center", padding: "32px" }}>
                <p className="page-subtitle">No benefit plans currently available. Contact HR to configure plans.</p>
              </div>
            ) : (
              <>
                <select
                  className="select-control"
                  style={{ width: "100%", marginTop: "16px" }}
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                >
                  <option value="">Select a plan…</option>
                  {planList.map((p: ApiRecord) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name ?? p.plan_name ?? p.component_name ?? "Plan"}
                    </option>
                  ))}
                </select>
                {selectedPlanId && (() => {
                  const plan = planList.find((p: ApiRecord) => String(p.id) === selectedPlanId);
                  if (!plan) return null;
                  return (
                    <div className="note" style={{ marginTop: "12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px" }}>
                      <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)", margin: "0 0 6px" }}>{plan.name ?? plan.plan_name}</p>
                      <p className="page-subtitle">{plan.description ?? plan.coverage ?? "No description available"}</p>
                      <p className="page-subtitle" style={{ marginTop: "4px" }}>
                        Cost: KES {Number(plan.monthly_cost ?? plan.amount ?? plan.cost ?? 0).toLocaleString()} / month
                      </p>
                    </div>
                  );
                })()}
                <div className="action-row payroll-modal-actions">
                  <button className="button button-secondary" onClick={() => { setEnrollOpen(false); setSelectedPlanId(""); }}>Cancel</button>
                  <button
                    className="button button-primary"
                    disabled={!selectedPlanId || enrolling || enrollMutation.isPending}
                    onClick={() => {
                      if (selectedPlanId) {
                        setEnrolling(true);
                        enrollMutation.mutate(Number(selectedPlanId));
                      }
                    }}
                  >
                    <Plus size={15} aria-hidden="true" />
                    {enrollMutation.isPending ? "Submitting…" : "Submit enrollment"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Enrolled Benefits */}
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Enrolled Benefits</h3>
        </div>
        <div className="panel-body">
          {enrollments.isLoading ? (
            <div style={{ textAlign: "center", padding: "48px" }}>
              <LoaderCircle className="mx-auto animate-spin" />
              <p className="page-subtitle" style={{ marginTop: "12px" }}>Loading your benefits…</p>
            </div>
          ) : benefits.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px" }}>
              <p className="page-subtitle">You have no benefits enrolled yet. Click <strong>Enroll</strong> to get started.</p>
            </div>
          ) : (
            <div className="grid-2col">
              {benefits.map((benefit: ApiRecord) => (
                <div key={benefit.id} className="note" style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "16px", background: "var(--surface)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                    <div>
                      <p className="eyebrow">{benefit.plan_type ?? benefit.type ?? benefit.category ?? "benefit"}</p>
                      <h4 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)", margin: "4px 0 0" }}>
                        {benefit.plan_name ?? benefit.name ?? benefit.component_name ?? "Benefit"}
                      </h4>
                    </div>
                    <span className={`pill pill-${benefit.status === "active" ? "success" : benefit.status === "pending" ? "warning" : "info"}`}>
                      {benefit.status ?? "active"}
                    </span>
                  </div>
                  <p className="page-subtitle">{benefit.coverage ?? benefit.description ?? "No coverage details"}</p>
                  <p className="page-subtitle" style={{ marginTop: "4px" }}>Dependents: {benefit.dependents ?? 0}</p>
                  <button
                    className="button button-secondary button-sm"
                    style={{ marginTop: "10px" }}
                    onClick={() => setSelectedBenefit(benefit)}
                  >
                    <Eye size={14} /> View details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefit Detail Modal */}
      {selectedBenefit && (
        <div className="modal-backdrop" role="presentation">
          <div className="module-modal" style={{ maxWidth: "520px" }}>
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Benefit detail</div>
                <h2>{selectedBenefit.plan_name ?? selectedBenefit.name ?? "Benefit"}</h2>
              </div>
              <button className="panel-action" onClick={() => setSelectedBenefit(null)}>Close</button>
            </div>
            <div className="section-stack" style={{ marginTop: "16px" }}>
              <div className="note"><p className="eyebrow">Type</p><p className="compact-metric">{selectedBenefit.plan_type ?? selectedBenefit.type ?? "—"}</p></div>
              <div className="note"><p className="eyebrow">Status</p><p className="compact-metric">{selectedBenefit.status ?? "—"}</p></div>
              <div className="note"><p className="eyebrow">Coverage</p><p className="compact-metric">{selectedBenefit.coverage ?? selectedBenefit.description ?? "—"}</p></div>
              <div className="note"><p className="eyebrow">Cost</p><p className="compact-metric">KES {Number(selectedBenefit.monthly_cost ?? selectedBenefit.amount ?? 0).toLocaleString()} / month</p></div>
              <div className="note"><p className="eyebrow">Dependents</p><p className="compact-metric">{selectedBenefit.dependents ?? 0}</p></div>
            </div>
            <div className="action-row payroll-modal-actions">
              <button className="button button-primary" onClick={() => setSelectedBenefit(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <PageChatbotWidget
        page="my-benefits"
        role="Employee"
        contextSummary={`${benefits.length} plans enrolled.`}
        quickPrompts={["What benefits am I enrolled in?", "Can I add dependents?", "How do I enroll in a new plan?"]}
      />
    </div>
  );
}
