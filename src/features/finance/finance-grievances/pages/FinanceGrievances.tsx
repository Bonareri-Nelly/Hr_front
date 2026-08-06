import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../../services/api/api";
import { resources } from "../../../../services/api/resources";

type GrievanceTicket = {
  id: string;
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  escalatedDate: string;
  hrMessage: string;
  status: string;
  attachment?: string | null;
  category?: string;
  subject?: string;
};

const list = <T,>(data: T[] | { results?: T[] }) => (Array.isArray(data) ? data : data.results ?? []);

export default function FinanceGrievances() {
  const client = useQueryClient();
  const attachmentRef = useRef<HTMLInputElement>(null);

  const [feedbackMsg, setFeedbackMsg] = useState<string>("");
  const [submitMsg, setSubmitMsg] = useState<string>("");

  const [form, setForm] = useState({
    category: "Payroll dispute",
    subject: "",
    details: "",
    preferred_resolution: "Investigation requested",
    confidentiality: "Standard",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const complaintsQuery = useQuery({
    queryKey: ["hr-complaints"],
    queryFn: async () =>
      list((await api.get<unknown[]>("/hr-operations/complaints/")).data),
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      resources.complaints.update(Number(id), { status }),
    onSuccess: (_data, variables) => {
      setFeedbackMsg(
        `Workflow status for ticket ${variables.id} updated to [${variables.status}] successfully.`,
      );
      client.invalidateQueries({ queryKey: ["hr-complaints"] });
      setTimeout(() => setFeedbackMsg(""), 5000);
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!form.subject.trim() || !form.details.trim()) {
        throw new Error("Please provide a subject and details for your grievance.");
      }
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      const file = attachmentRef.current?.files?.[0];
      if (file) body.append("attachment", file);
      await api.post("/hr-operations/complaints/", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      setForm({
        category: "Payroll dispute",
        subject: "",
        details: "",
        preferred_resolution: "Investigation requested",
        confidentiality: "Standard",
      });
      if (attachmentRef.current) attachmentRef.current.value = "";
      setSubmitMsg("Grievance submitted successfully.");
      client.invalidateQueries({ queryKey: ["hr-complaints"] });
      setTimeout(() => setSubmitMsg(""), 5000);
    },
    onError: (err) => {
      setSubmitMsg(err instanceof Error ? err.message : "Could not submit the grievance.");
      setTimeout(() => setSubmitMsg(""), 5000);
    },
  });

  const tickets: GrievanceTicket[] = (complaintsQuery.data ?? []).map((c: any) => ({
    id: String(c.id),
    employeeId: String(c.employee_code ?? c.employee_id ?? c.id ?? ""),
    employeeName: String(c.employee_name ?? c.complainant_name ?? c.employee ?? "Unknown"),
    branch: String(c.branch ?? "—"),
    department: String(c.department ?? "—"),
    escalatedDate:
      c.created_at && typeof c.created_at === "string"
        ? new Date(c.created_at).toLocaleString()
        : "—",
    hrMessage: String(c.description ?? c.details ?? c.reason ?? ""),
    status: String(c.status ?? "open"),
    attachment: c.attachment ?? null,
    category: String(c.category ?? ""),
    subject: String(c.subject ?? ""),
  }));

  const pendingCount = tickets.filter((t) =>
    t.status === "open" || t.status === "pending",
  ).length;
  const activeCount = tickets.filter((t) =>
    t.status === "in_progress" || t.status === "in progress",
  ).length;
  const resolvedCount = tickets.filter((t) =>
    t.status === "resolved" || t.status === "completed" || t.status === "closed",
  ).length;

  const handleWorkflowTransition = (ticketId: string, nextStatus: string) => {
    resolveMutation.mutate({ id: ticketId, status: nextStatus });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="page-kicker">Finance & HR operations</p>
          <h1 className="page-title">HR financial escalations</h1>
          <p className="page-subtitle">
            Grievances received from HR regarding employee payroll, deduction disputes, or banking failures
            • <span style={{ color: "var(--warning)", fontWeight: 700 }}>{pendingCount} unassigned actions</span>
          </p>
        </div>
      </div>

      {feedbackMsg && <div className="alert alert-success mb-4">{feedbackMsg}</div>}
      {submitMsg && (
        <div className={`alert ${submitMsg.startsWith("Could not") ? "alert-error" : "alert-success"} mb-4`}>
          {submitMsg}
        </div>
      )}

      <div className="dashboard-grid two-columns">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Submit a grievance</h2>
          </div>
          <form
            className="panel-body"
            onSubmit={(event) => {
              event.preventDefault();
              submitMutation.mutate();
            }}
          >
            <div className="form-grid">
              <label className="field-group">
                <span className="field-label">Category</span>
                <select
                  className="field-input"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option>Payroll dispute</option>
                  <option>Deduction dispute</option>
                  <option>Banking failure</option>
                  <option>Salary adjustment</option>
                  <option>Benefits claim</option>
                  <option>Other financial concern</option>
                </select>
              </label>
              <label className="field-group">
                <span className="field-label">Preferred resolution</span>
                <select
                  className="field-input"
                  value={form.preferred_resolution}
                  onChange={(e) => update("preferred_resolution", e.target.value)}
                >
                  <option>Investigation requested</option>
                  <option>Mediation session</option>
                  <option>Direct action</option>
                  <option>Payroll correction</option>
                </select>
              </label>
              <label className="field-group">
                <span className="field-label">Subject</span>
                <input
                  required
                  className="field-input"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Brief subject line"
                />
              </label>
              <label className="field-group">
                <span className="field-label">Confidentiality</span>
                <select
                  className="field-input"
                  value={form.confidentiality}
                  onChange={(e) => update("confidentiality", e.target.value)}
                >
                  <option>Standard</option>
                  <option>Strictly confidential</option>
                </select>
              </label>
            </div>
            <label className="field-group">
              <span className="field-label">Details</span>
              <textarea
                required
                className="field-input"
                rows={5}
                value={form.details}
                onChange={(e) => update("details", e.target.value)}
                placeholder="Describe the grievance and any supporting information…"
              />
            </label>
            <label className="field-group">
              <span className="field-label">Attachment (optional)</span>
              <input
                ref={attachmentRef}
                type="file"
                className="field-input"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx,.csv"
              />
            </label>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="button button-primary"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "Submitting…" : "Submit grievance"}
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Grievance queue</h2>
          </div>
          <div className="panel-body">
            {complaintsQuery.isLoading ? (
              <p className="text-sm text-gray-500 text-center py-6">Loading escalations…</p>
            ) : tickets.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No escalated grievances at this time.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold">
                        #{ticket.id}
                      </span>
                      <h4 className="font-semibold text-sm text-gray-900">
                        {ticket.employeeName}{" "}
                        <span className="text-xs text-gray-500">({ticket.employeeId})</span>
                      </h4>
                      <span className="text-xs text-gray-500">
                        {ticket.branch} • {ticket.department} • {ticket.escalatedDate}
                      </span>
                    </div>
                    {ticket.subject && (
                      <p className="text-xs font-medium text-gray-700 mb-1">{ticket.subject}</p>
                    )}
                    <div className="rounded-md bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600 leading-relaxed mb-3">
                      <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1">
                        HR Narrative Context:
                      </span>
                      "{ticket.hrMessage}"
                    </div>
                    {ticket.attachment && (
                      <div className="mb-3">
                        <span className="text-[11px] text-gray-500">Attachment: </span>
                        <a
                          href={ticket.attachment}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View attachment
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {ticket.category && (
                          <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 text-[11px] font-medium">
                            {ticket.category}
                          </span>
                        )}
                      </div>
                      <div>
                        {ticket.status === "resolved" ||
                        ticket.status === "completed" ||
                        ticket.status === "closed" ? (
                          <span className="inline-flex items-center rounded-md bg-green-100 text-green-700 border border-green-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
                            Resolved
                          </span>
                        ) : ticket.status === "in_progress" ||
                          ticket.status === "in progress" ? (
                          <button
                            className="button button-primary button-sm"
                            onClick={() => handleWorkflowTransition(ticket.id, "resolved")}
                          >
                            Resolve issue
                          </button>
                        ) : (
                          <button
                            className="button button-secondary button-sm"
                            onClick={() => handleWorkflowTransition(ticket.id, "in_progress")}
                          >
                            Start processing
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="metrics mt-6">
        <div className="metric-cell">
          <p className="metric-label">Awaiting Assignment</p>
          <p
            className="metric-value compact-metric"
            style={{ color: "var(--warning)" }}
          >
            {pendingCount} tickets
          </p>
          <p className="metric-meta">Pending review</p>
        </div>
        <div className="metric-cell">
          <p className="metric-label">Active Investigation</p>
          <p
            className="metric-value compact-metric"
            style={{ color: "var(--primary)" }}
          >
            {activeCount} processing
          </p>
          <p className="metric-meta">In progress</p>
        </div>
        <div className="metric-cell">
          <p className="metric-label">Resolved</p>
          <p
            className="metric-value compact-metric"
            style={{ color: "var(--success)" }}
          >
            {resolvedCount} closed
          </p>
          <p className="metric-meta">Completed</p>
        </div>
      </div>
    </div>
  );
}
