import type { LeaveRequest } from "../utils/approvalWorkflow";

type ReviewLeaveModalProps = {
    open: boolean;
    request: LeaveRequest | undefined;
    onClose: () => void;
    onApprove: (comment: string) => void;
    onReject: (comment: string) => void;
};
import { useState } from "react";

export default function ReviewLeaveModal({
    open,
    request,
    onClose,
    onApprove,
    onReject,
}: ReviewLeaveModalProps) {
    const [comment, setComment] = useState("");

    if (!open || !request) return null;

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
                    <h2 className="panel-title">
                        Review Leave Request
                    </h2>

                    <button
                        className="button button-secondary"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}

                <div
                    className="panel-body"
                    style={{
                        display: "grid",
                        gap: "18px",
                    }}
                >
                    <SummaryRow
                        label="Employee"
                        value={request.employee}
                    />

                    <SummaryRow
                        label="Department"
                        value={request.department}
                    />

                    <SummaryRow
                        label="Role"
                        value={request.employeeRole}
                    />

                    <SummaryRow
                        label="Leave Type"
                        value={request.leaveType}
                    />

                    <SummaryRow
                        label="Period"
                        value={`${request.startDate} - ${request.endDate}`}
                    />

                    <SummaryRow
                        label="Days"
                        value={`${request.days} Day(s)`}
                    />

                    <SummaryRow
                        label="Workflow Stage"
                        value={request.workflowStage}
                    />

                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: 600,
                            }}
                        >
                            Manager Comment
                        </label>

                        <textarea
                            rows={4}
                            value={comment}
                            onChange={(e) =>
                                setComment(e.target.value)
                            }
                            style={{
                                width: "100%",
                                resize: "vertical",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                fontFamily: "inherit",
                            }}
                            placeholder="Add your comment..."
                        />
                    </div>
                </div>

                {/* Footer */}

                <div
                    style={{
                        borderTop: "1px solid var(--border-subtle)",
                        padding: "16px 18px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <button
                        className="button button-danger"
                        onClick={() => onReject(comment)}
                    >
                        Reject
                    </button>

                    <button
                        className="button button-success"
                        onClick={() => onApprove(comment)}
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
}

function SummaryRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom:
                    "1px solid var(--border-subtle)",
                paddingBottom: "10px",
            }}
        >
            <strong>{label}</strong>

            <span>{value}</span>
        </div>
    );
}