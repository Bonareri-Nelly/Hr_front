import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import ApplyLeaveModal from "./components/ApplyLeaveModal";
import LeaveCalendar from "./components/LeaveCalendar";
import HRLeaveEntitlementsCard from "./components/HRLeaveEntitlementsCard";
import ReplacementDecisionPanel from "./components/ReplacementDecisionPanel";
import { mockEmployees } from "./data/mockEmployees";
import type {
  LeaveEntitlements,
  LeaveTypeKey,
  ReplacementWorkflowState,
} from "./types/leaveWorkflowTypes";

const recentRequests = [
  {
    id: 1,
    type: "Annual Leave",
    period: "09 Jul - 13 Jul 2026",
    days: 5,
    status: "Pending",
  },
  {
    id: 2,
    type: "Sick Leave",
    period: "15 Jun - 16 Jun 2026",
    days: 2,
    status: "Approved",
  },
];

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
  const loggedInEmployee = mockEmployees[0];
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
            1
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
            3
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
                {recentRequests.map((leave) => (
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
                            leave.status === "Approved"
                              ? "var(--success-bg)"
                              : "var(--warning-bg)",
                          color:
                            leave.status === "Approved"
                              ? "var(--success)"
                              : "var(--warning)",
                        }}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
                employeeGender={loggedInEmployee.gender}
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

