import { useMemo, useState } from "react";
import { leavePolicies } from "../constants/leavePolicies";

type ApplyLeaveModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ApplyLeaveModal({
  open,
  onClose,
}: ApplyLeaveModalProps) {
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const policy =
    leaveType !== ""
      ? leavePolicies[leaveType as keyof typeof leavePolicies]
      : null;

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return "--";

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) return "Invalid";

    const diff =
      Math.floor(
        (end.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    return `${diff} day${diff > 1 ? "s" : ""}`;
  }, [startDate, endDate]);

  if (!open) return null;

  const handleLeaveTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLeaveType(e.target.value);

    // Reset dependent fields
    setReason("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        zIndex: 1000,
      }}
    >
      <div
        className="panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}

        <div className="panel-header">
          <h2 className="panel-title">Apply for Leave</h2>

          <button
            className="button button-secondary"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}

        <div className="panel-body">

          {/* Leave Type & Reason */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Leave Type
              </label>

              <select
                style={fieldStyle}
                value={leaveType}
                onChange={handleLeaveTypeChange}
              >
                <option value="">
                  Select Leave Type
                </option>

                {Object.entries(leavePolicies).map(
                  ([key, value]) => (
                    <option
                      key={key}
                      value={key}
                    >
                      {value.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Reason
              </label>

              <select
                style={fieldStyle}
                value={reason}
                disabled={!policy}
                onChange={(e) =>
                  setReason(e.target.value)
                }
              >
                <option value="">
                  {policy
                    ? "Select Reason"
                    : "Select Leave Type First"}
                </option>

                {policy?.reasons.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notice */}

          <div
            style={{
              background: "var(--info-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "14px",
              marginBottom: "20px",
            }}
          >
            <strong>Leave Notice</strong>

            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "var(--text-secondary)",
                fontSize: ".8rem",
                lineHeight: 1.6,
              }}
            >
              {!policy &&
                "Select a leave type to view the applicable notice period."}

              {policy &&
                (policy.emergency
                  ? `${policy.label} can be applied for immediately.`
                  : `${policy.label} requires at least ${policy.noticeDays} days' notice.`)}
            </p>
          </div>

          {/* Dates */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 180px",
              gap: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Start Date
              </label>

              <input
                type="date"
                style={fieldStyle}
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>
                End Date
              </label>

              <input
                type="date"
                style={fieldStyle}
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>
                Total Days
              </label>

              <div
                style={{
                  ...fieldStyle,
                  display: "flex",
                  alignItems: "center",
                  background: "var(--background)",
                }}
              >
                {totalDays}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "16px 18px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            className="button button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="button button-primary">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: ".8rem",
  fontWeight: 600,
};

const fieldStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  background: "var(--surface)",
  color: "var(--ink)",
  fontSize: ".8rem",
  boxSizing: "border-box" as const,
};