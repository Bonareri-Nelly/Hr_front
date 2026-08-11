import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ApplyLeaveModal from "./components/ApplyLeaveModal";
import LeaveCalendar from "./components/LeaveCalendar";
import HRLeaveEntitlementsCard from "./components/HRLeaveEntitlementsCard";
import ReplacementDecisionPanel from "./components/ReplacementDecisionPanel";
import { employeeApi } from "../../services/api/employee";
import { leaveApi } from "../../services/api/leave";
import { apiClient } from "../../services/api/client";
import type {
  LeaveEntitlements,
  LeaveTypeKey,
  ReplacementWorkflowState,
} from "./types/leaveWorkflowTypes";

const initialEntitlements: LeaveEntitlements = {
  annual: 16,
  sick: 10,
  maternity: "Eligible",
  paternity: "Eligible",
  compassionate: 5,
  study: 10,
  unpaid: "As Required",
};

export default function LeaveWorkflow() {
  const [loggedInEmployee, setLoggedInEmployee] = useState<{ id: number; name: string; department: string; gender?: "Male" | "Female" } | null>(null);
  const [recentRequests, setRecentRequests] = useState<Array<{ id: number; type: string; period: string; days: number; status: string }>>([]);
  const [requestSummary, setRequestSummary] = useState({ pending: 0, approved: 0 });
  const [leaveTypeIds, setLeaveTypeIds] = useState<Record<string, number>>({});
  const [openModal, setOpenModal] = useState(false);
  const [openEntitlements, setOpenEntitlements] = useState(false);
  const [openReplacementDemo, setOpenReplacementDemo] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    status: "planned",
  });

  // HR toggle (local demo - there is no auth/role in this repo)
  const [actingAsHrOfficer, setActingAsHrOfficer] = useState(false);

  const [entitlements, setEntitlements] = useState<LeaveEntitlements>(
    initialEntitlements
  );

  const leaveBalances = useMemo(() => {
    return [
      { type: "Annual Leave", value: `${entitlements.annual} Days Remaining` },
      { type: "Sick Leave", value: `${entitlements.sick} Days Available` },
      { type: "Maternity Leave", value: String(entitlements.maternity) },
      { type: "Paternity Leave", value: String(entitlements.paternity) },
      { type: "Compassionate Leave", value: `${entitlements.compassionate} Days` },
      { type: "Study Leave", value: `${entitlements.study} Days` },
      { type: "Unpaid Leave", value: String(entitlements.unpaid) },
    ];
  }, [entitlements]);

  // Replacement workflow state (local mock)
  const [replacementState, setReplacementState] = useState<ReplacementWorkflowState>(
    () => ({
      status: "idle",
      applierDepartment: "Engineering",
      attempts: [],
      currentEmployeeId: null,
      currentAttemptNumber: 0,
    })
  );

  // The applierDepartment is mocked (no auth/department context in this repo).
  // If you later connect this to real employee context, we can replace it.
  const applierDepartment = replacementState.applierDepartment;

  const currentPolicyRequiresSubstitute = useMemo(() => {
    // Selected leave.leaveType holds the leavePolicies key in ApplyLeaveModal.
    // We pass it as-is and infer from selectedLeave.leaveType.
    const t = (selectedLeave.leaveType || "") as LeaveTypeKey;
    return t === "annual" || t === "maternity" || t === "paternity" || t === "study" || t === "unpaid";
  }, [selectedLeave.leaveType]);

  const isReplacementNeeded = currentPolicyRequiresSubstitute;

  const [actingAsReplacement, setActingAsReplacement] = useState(false);

  const loadData = async () => {
      try {
        const [employees, leaveTypes, leaveRequests, balances, meResponse] = await Promise.all([
          employeeApi.list({ page_size: "200" }).catch(() => []),
          leaveApi.listTypes().catch(() => []),
          leaveApi.listRequests().catch(() => []),
          leaveApi.listBalances().catch(() => []),
          apiClient.get("/auth/me/").catch(() => ({ data: {} })),
        ]);

        const employeeRecords = employees as Array<Record<string, unknown>>;
        const balanceRecords = balances as Array<Record<string, unknown>>;
        const linkedEmployeeId = Number(meResponse.data?.employee_profile_id ?? 0);
        let currentEmployee = linkedEmployeeId
          ? await employeeApi.get(linkedEmployeeId).catch(() => undefined) as Record<string, unknown> | undefined
          : employeeRecords.find((employee) => String(employee.id) === String(balanceRecords[0]?.employee));
        if (!currentEmployee && balanceRecords[0]?.employee) {
          currentEmployee = await employeeApi.get(Number(balanceRecords[0].employee)).catch(() => undefined) as Record<string, unknown> | undefined;
        }
        currentEmployee ??= employeeRecords[0];
        if (!currentEmployee) return;
        setLoggedInEmployee({
          id: Number(currentEmployee.id),
          name: [currentEmployee?.first_name, currentEmployee?.last_name].filter(Boolean).join(' ') || 'Employee',
          department: String(currentEmployee?.department_name ?? currentEmployee?.department ?? 'Operations'),
          gender: (currentEmployee?.gender === 'F' || currentEmployee?.gender === 'Female' ? 'Female' : 'Male') as "Male" | "Female",
        });

        const ids: Record<string, number> = {};
        (leaveTypes as Array<Record<string, unknown>>).forEach((type) => {
          const key = String(type.code ?? '').toLowerCase();
          if (["annual", "sick", "maternity", "paternity", "compassionate", "study", "unpaid"].includes(key) && type.id) ids[key] = Number(type.id);
        });
        setLeaveTypeIds(ids);

        const nextEntitlements = { ...initialEntitlements };
        balanceRecords.filter((balance) => String(balance.employee) === String(currentEmployee.id)).forEach((balance) => {
          const leaveType = (leaveTypes as Array<Record<string, unknown>>).find((type) => String(type.id) === String(balance.leave_type));
          const key = String(leaveType?.code ?? '').toLowerCase();
          if (key === "annual" || key === "sick" || key === "compassionate" || key === "study") nextEntitlements[key] = Number(balance.remaining_days ?? 0);
        });
        setEntitlements(nextEntitlements);

        const employeeRequests = (leaveRequests as Array<Record<string, unknown>>).filter((request) => String(request.employee) === String(currentEmployee.id));
        const mappedRequests = employeeRequests.slice(0, 4).map((request) => {
          const start = String(request.start_date ?? '');
          const end = String(request.end_date ?? '');
          const type = String(request.leave_type_name ?? (leaveTypes as Array<Record<string, unknown>>).find((item) => String(item.id) === String(request.leave_type ?? ''))?.name ?? 'Leave');
          const days = start && end ? Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1) : 1;

          return {
            id: Number(request.id ?? 0),
            type: String(type),
            period: start && end ? `${start} - ${end}` : 'Pending',
            days,
            status: String(request.status ?? 'Pending'),
          };
        });

        setRecentRequests(mappedRequests);
        setRequestSummary({ pending: employeeRequests.filter((request) => String(request.status).startsWith("PENDING")).length, approved: employeeRequests.filter((request) => request.status === "APPROVED").length });
      } catch {
        setRecentRequests([]);
      }
    };

  useEffect(() => { void loadData(); }, []);

  const handleLeaveRequest = async (data: { leaveType: string; leaveTypeId: number; reason: string; startDate: string; endDate: string }) => {
    if (!loggedInEmployee) throw new Error("Employee profile is unavailable.");
    await leaveApi.createRequest({ employee_id: loggedInEmployee.id, leave_type_id: data.leaveTypeId, start_date: data.startDate, end_date: data.endDate, reason: data.reason });
    setSelectedLeave({ startDate: data.startDate, endDate: data.endDate, leaveType: data.leaveType, status: "pending" });
    await loadData();
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="page-title">Leave Workflow</h1>
          <p className="page-subtitle">Manage your leave requests and balances.</p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="button button-secondary"
            onClick={() => setActingAsHrOfficer((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            {actingAsHrOfficer ? "✓ Acting as HR Officer" : "Act as HR Officer"}
          </button>

          <button
            className="button button-primary"
            onClick={() => setOpenModal(true)}
          >
            <Plus size={14} />
            Apply for Leave
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "12px",
        }}
      >
        <div className="summary-card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Annual Leave
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            {entitlements.annual}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Days Remaining
          </div>
        </div>

        <div className="summary-card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Sick Leave
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            {entitlements.sick}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Days Available
          </div>
        </div>

        <div className="summary-card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Pending Requests
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            {requestSummary.pending}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Awaiting Approval
          </div>
        </div>

        <div className="summary-card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Approved
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            {requestSummary.approved}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            This Year
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "14px",
        }}
      >
        {/* RECENT REQUESTS */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Leave Requests</h2>
          </div>

          <div className="panel-body table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Period</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.length ? recentRequests.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.type}</td>
                    <td>{leave.period}</td>
                    <td>{leave.days}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          background:
                            leave.status === "APPROVED"
                              ? "var(--success-bg)"
                              : "var(--warning-bg)",
                          color:
                            leave.status === "APPROVED"
                              ? "var(--success)"
                              : "var(--warning)",
                        }}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                )) : <tr><td colSpan={4} style={{ color: "var(--text-secondary)", textAlign: "center", padding: 20 }}>No leave requests yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "grid", gap: 14 }}>
          {/* LEAVE BALANCES + APPLY */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Leave Balances</h2>
            </div>

            <div className="panel-body">
              {leaveBalances.map((leave) => (
                <div
                  key={leave.type}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-subtle)",
                    fontSize: "0.8rem",
                  }}
                >
                  <span>{leave.type}</span>
                  <strong>{leave.value}</strong>
                </div>
              ))}

              <ApplyLeaveModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                employeeGender={(loggedInEmployee?.gender as "Male" | "Female") ?? "Female"}
                leaveTypeIds={leaveTypeIds}
                onSubmit={handleLeaveRequest}
                setSelectedLeave={setSelectedLeave}
              />
            </div>
          </div>

          {actingAsHrOfficer ? <CompactActionCard title="HR Leave Entitlements" description="Review and update employee leave balances." action="Manage Entitlements" onClick={() => setOpenEntitlements(true)} /> : null}
          <CompactActionCard title="Replacement Demo" description="Manage replacement decisions without expanding the page." action="Manage Replacement" onClick={() => setOpenReplacementDemo(true)} />

          {actingAsHrOfficer ? (
            <HRLeaveEntitlementsCard
              open={openEntitlements}
              entitlements={entitlements}
              onClose={() => setOpenEntitlements(false)}
              onChangeEntitlements={(next) => setEntitlements(next)}
            />
          ) : null}

          {/* REPLACEMENT WORKFLOW SIMULATION */}
          {openReplacementDemo ? <WorkflowModal onClose={() => setOpenReplacementDemo(false)}>{isReplacementNeeded ? (
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Replacement workflow (demo)</h2>
              </div>
              <div className="panel-body" style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    className="button button-secondary"
                    onClick={() => setActingAsReplacement((v) => !v)}
                  >
                    {actingAsReplacement ? "Acting as replacement ✓" : "Toggle: acting as replacement"}
                  </button>
                </div>

                <ReplacementDecisionPanel
                  applierDepartment={applierDepartment}
                  currentEmployeeId={replacementState.currentEmployeeId}
                  currentAttemptNumber={replacementState.currentAttemptNumber}
                  attempts={replacementState.attempts}
                  actingAsReplacement={actingAsReplacement}
                  replacementEmployeeName={null}
                  onDecision={(decision) => {
                    setReplacementState((prev) => {
                      if (!prev.currentEmployeeId) return prev;

                      const updatedAttempts = prev.attempts.map((a) => {
                        if (
                          a.employeeId === prev.currentEmployeeId &&
                          a.attemptNumber === prev.currentAttemptNumber
                        ) {
                          return {
                            ...a,
                            decision,
                            decisionAt: Date.now(),
                          };
                        }
                        return a;
                      });

                      if (decision === "accepted") {
                        return {
                          ...prev,
                          status: "accepted",
                          attempts: updatedAttempts,
                        };
                      }

                      // rejected: keep loop, reset current employee to force re-selection
                      return {
                        ...prev,
                        status: "replacement_needed",
                        attempts: updatedAttempts,
                        currentEmployeeId: null,
                        currentAttemptNumber: prev.attempts.length + 1,
                      };
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Replacement workflow</h2>
              </div>
              <div className="panel-body" style={{ color: "var(--text-secondary)" }}>
                Select a leave type that requires a substitute to enable the replacement workflow demo.
              </div>
            </div>
          )}</WorkflowModal> : null}
        </div>

        <div style={{ marginTop: "32px", gridColumn: "1 / -1" }}>
          <LeaveCalendar selectedLeave={selectedLeave} />
        </div>
      </div>
    </div>
  );
}

function CompactActionCard({ title, description, action, onClick }: { title: string; description: string; action: string; onClick: () => void }) {
  return <div className="panel"><div className="panel-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", flexWrap: "wrap" }}><div><strong style={{ fontSize: ".9rem" }}>{title}</strong><div style={{ color: "var(--text-secondary)", fontSize: ".75rem", marginTop: 3 }}>{description}</div></div><button className="button button-secondary" onClick={onClick}>{action}</button></div></div>;
}

function WorkflowModal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1100, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)" }}><div className="panel" onClick={(event) => event.stopPropagation()} style={{ width: "100%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto" }}><div className="panel-header"><h2 className="panel-title">Replacement Demo</h2><button className="button button-secondary" onClick={onClose}>✕</button></div>{children}<div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 18px", borderTop: "1px solid var(--border-subtle)" }}><button className="button button-secondary" onClick={onClose}>Close</button></div></div></div>;
}

