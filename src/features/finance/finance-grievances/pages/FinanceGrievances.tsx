import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resources, type ApiRecord } from '../../../../services/api/resources';

type GrievanceTicket = {
  id: string;
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  escalatedDate: string;
  hrMessage: string;
  status: string;
};

export default function FinanceGrievances() {
  const client = useQueryClient();
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const complaintsQuery = useQuery({
    queryKey: ['hr-complaints'],
    queryFn: () => resources.complaints.list(),
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return resources.complaints.update(Number(id), { status });
    },
    onSuccess: (_data, variables) => {
      setFeedbackMsg(`Workflow status for ticket ${variables.id} updated to [${variables.status}] successfully.`);
      client.invalidateQueries({ queryKey: ['hr-complaints'] });
      setTimeout(() => setFeedbackMsg(''), 5000);
    },
  });

  const tickets: GrievanceTicket[] = ((complaintsQuery.data ?? []) as ApiRecord[]).map((c: ApiRecord) => ({
    id: String(c.id),
    employeeId: String(c.employee_code ?? c.employee_id ?? c.id),
    employeeName: String(c.employee_name ?? c.complainant_name ?? c.employee ?? 'Unknown'),
    branch: String(c.branch ?? '—'),
    department: String(c.department ?? '—'),
    escalatedDate: c.created_at ? new Date(c.created_at).toLocaleString() : '—',
    hrMessage: String(c.description ?? c.details ?? c.reason ?? ''),
    status: String(c.status ?? 'open'),
  }));

  const pendingCount = tickets.filter(t => t.status === 'open' || t.status === 'pending').length;
  const activeCount = tickets.filter(t => t.status === 'in_progress' || t.status === 'in progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'completed' || t.status === 'closed').length;

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
            Grievances received from HR regarding employee payroll, deduction disputes, or banking failures • <span style={{ color: "var(--warning)", fontWeight: 700 }}>{pendingCount} unassigned actions</span>
          </p>
        </div>
      </div>

      {feedbackMsg && <div className="alert alert-success">{feedbackMsg}</div>}

      <div className="metrics">
        <div className="metric-cell">
          <p className="metric-label">Awaiting Assignment</p>
          <p className="metric-value compact-metric" style={{ color: "var(--warning)" }}>{pendingCount} tickets</p>
          <p className="metric-meta">Pending review</p>
        </div>
        <div className="metric-cell">
          <p className="metric-label">Active Investigation</p>
          <p className="metric-value compact-metric" style={{ color: "var(--primary)" }}>{activeCount} processing</p>
          <p className="metric-meta">In progress</p>
        </div>
        <div className="metric-cell">
          <p className="metric-label">Resolved</p>
          <p className="metric-value compact-metric" style={{ color: "var(--success)" }}>{resolvedCount} closed</p>
          <p className="metric-meta">Completed</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">HR operational dispute queue</h3>
        </div>
        {complaintsQuery.isLoading ? (
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <p className="page-subtitle">Loading escalations…</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <p className="page-subtitle">No escalated grievances at this time.</p>
          </div>
        ) : (
          <div className="panel-body">
            <div className="section-stack">
              {tickets.map((ticket) => (
                <div key={ticket.id} style={{ padding: "16px 0", borderBottom: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span className="eyebrow" style={{ background: "var(--surface)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)" }}>{ticket.id}</span>
                    <h4 style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)" }}>
                      {ticket.employeeName} <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>({ticket.employeeId})</span>
                    </h4>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                      {ticket.branch} • {ticket.department} • Escalated: {ticket.escalatedDate}
                    </span>
                  </div>
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>HR Narrative Context:</span>
                    "{ticket.hrMessage}"
                  </div>
                  <div style={{ alignSelf: "flex-end" }}>
                    {ticket.status === 'resolved' || ticket.status === 'completed' || ticket.status === 'closed' ? (
                      <span style={{ padding: "4px 12px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)" }}>Resolved</span>
                    ) : ticket.status === 'in_progress' || ticket.status === 'in progress' ? (
                      <button className="button button-primary button-sm" onClick={() => handleWorkflowTransition(ticket.id, 'resolved')}>Resolve issue</button>
                    ) : (
                      <button className="button button-secondary button-sm" onClick={() => handleWorkflowTransition(ticket.id, 'in_progress')}>Start processing</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
