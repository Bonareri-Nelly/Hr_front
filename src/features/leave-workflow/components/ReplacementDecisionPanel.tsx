import { useMemo } from "react";
import type { ReplacementAttempt } from "../types/leaveWorkflowTypes";

type ReplacementDecisionPanelProps = {
  applierDepartment: string;
  currentEmployeeId: string | null;
  currentAttemptNumber: number;
  attempts: ReplacementAttempt[];
  actingAsReplacement: boolean;
  replacementEmployeeName?: string | null;
  onDecision: (decision: "accepted" | "rejected") => void;
};

export default function ReplacementDecisionPanel({
  applierDepartment,
  currentEmployeeId,
  currentAttemptNumber,
  attempts,
  actingAsReplacement,
  replacementEmployeeName,
  onDecision,
}: ReplacementDecisionPanelProps) {
  const currentAttempt = useMemo(() => {
    const found = attempts.find(
      (a) =>
        a.employeeId === currentEmployeeId &&
        a.attemptNumber === currentAttemptNumber
    );
    return found ?? null;
  }, [attempts, currentEmployeeId, currentAttemptNumber]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Replacement Decision</h2>
        </div>

        <div className="panel-body" style={{ display: "grid", gap: 10 }}>
          <div
            style={{
              background: "var(--info-bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div style={{ fontSize: ".85rem", color: "var(--text-secondary)" }}>
              Department restriction
            </div>
            <div style={{ fontWeight: 700 }}>{applierDepartment}</div>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>
              Notified replacement (current attempt #{currentAttemptNumber})
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <strong style={{ fontSize: ".95rem" }}>
                {replacementEmployeeName ??
                  (currentEmployeeId ? "Employee selected" : "-")}
              </strong>

              {actingAsReplacement ? (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: ".65rem",
                    fontWeight: 800,
                    background: "var(--success-bg)",
                    color: "var(--success)",
                  }}
                >
                  Acting as replacement
                </span>
              ) : (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: ".65rem",
                    fontWeight: 800,
                    background: "var(--warning-bg)",
                    color: "var(--warning)",
                  }}
                >
                  Acting as applier
                </span>
              )}
            </div>
          </div>

          {currentEmployeeId && actingAsReplacement ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="button button-secondary"
                onClick={() => onDecision("rejected")}
              >
                Reject
              </button>
              <button
                className="button button-primary"
                onClick={() => onDecision("accepted")}
              >
                Accept
              </button>
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>
              Toggle to “Acting as replacement” to accept or reject.
            </div>
          )}

          {currentAttempt ? (
            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>
                Latest decision on this attempt
              </div>
              <div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: ".65rem",
                    fontWeight: 800,
                    background:
                      currentAttempt.decision === "accepted"
                        ? "var(--success-bg)"
                        : "var(--warning-bg)",
                    color:
                      currentAttempt.decision === "accepted"
                        ? "var(--success)"
                        : "var(--warning)",
                  }}
                >
                  {currentAttempt.decision === "accepted" ? "Accepted" : "Rejected"}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Applier visibility</h2>
        </div>
        <div className="panel-body" style={{ display: "grid", gap: 10 }}>
          {attempts.length === 0 ? (
            <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>
              No replacement attempts yet.
            </div>
          ) : (
            attempts
              .slice()
              .sort((a, b) => a.attemptNumber - b.attemptNumber)
              .map((a) => (
                <div
                  key={`${a.employeeId}-${a.attemptNumber}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ display: "grid", gap: 3 }}>
                    <strong style={{ fontSize: ".85rem" }}>
                      Attempt #{a.attemptNumber}
                    </strong>
                    <span style={{ color: "var(--text-secondary)", fontSize: ".75rem" }}>
                      Employee ID: {a.employeeId}
                    </span>
                  </div>

                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: ".65rem",
                      fontWeight: 800,
                      background:
                        a.decision === "accepted"
                          ? "var(--success-bg)"
                          : "var(--warning-bg)",
                      color:
                        a.decision === "accepted"
                          ? "var(--success)"
                          : "var(--warning)",
                      height: "fit-content",
                    }}
                  >
                    {a.decision === "accepted" ? "Accepted" : "Rejected"}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
