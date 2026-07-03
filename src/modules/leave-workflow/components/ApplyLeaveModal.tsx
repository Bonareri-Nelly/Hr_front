import { useMemo, useState } from "react";
import { leavePolicies } from "../constants/leavePolicies";
import { getMinimumStartDate } from "../utils/leaveDates";

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
    const [step, setStep] = useState<
        "form" | "summary" | "success"
    >("form");
    const [errors, setErrors] = useState({
        leaveType: "",
        reason: "",
        startDate: "",
        endDate: "",
    });
    const resetForm = () => {
        setLeaveType("");
        setReason("");
        setStartDate("");
        setEndDate("");

        setErrors({
            leaveType: "",
            reason: "",
            startDate: "",
            endDate: "",
        });

        setStep("form");
    };
    const handleClose = () => {
        resetForm();
        onClose();
    };

    const policy =
        leaveType !== ""
            ? leavePolicies[leaveType as keyof typeof leavePolicies]
            : null;

    const minimumStartDate = policy
        ? getMinimumStartDate(policy.noticeDays)
        : "";

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
    const validateForm = () => {
        const newErrors = {
            leaveType: "",
            reason: "",
            startDate: "",
            endDate: "",
        };


        let valid = true;

        if (!leaveType) {
            newErrors.leaveType = "Please select a leave type.";
            valid = false;
        }

        if (!reason) {
            newErrors.reason = "Please select a reason.";
            valid = false;
        }

        if (!startDate) {
            newErrors.startDate = "Please select a start date.";
            valid = false;
        }

        if (!endDate) {
            newErrors.endDate = "Please select an end date.";
            valid = false;
        }

        setErrors(newErrors);

        return valid;
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

                    {step === "form" && (
                        <>
                            <h2 className="panel-title">
                                Apply for Leave
                            </h2>

                            <button
                                className="button button-secondary"
                                onClick={() => {
                                    setStep("form");
                                    onClose();
                                }}
                            >
                                ✕
                            </button>
                        </>
                    )}

                    {step === "summary" && (
                        <h2 className="panel-title">
                            Review Leave Request
                        </h2>
                    )}

                </div>

                {/* Body */}

                <div className="panel-body">

                    {step === "form" && (
                        <>
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
                                        style={{
                                            ...fieldStyle,
                                            borderColor: errors.leaveType
                                                ? "var(--danger)"
                                                : "var(--border)",
                                        }}
                                        value={leaveType}
                                        onChange={(e) => {
                                            handleLeaveTypeChange(e);

                                            setErrors((prev) => ({
                                                ...prev,
                                                leaveType: "",
                                            }));
                                        }}
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

                                    {errors.leaveType && (
                                        <p style={errorStyle}>
                                            {errors.leaveType}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label style={labelStyle}>
                                        Reason
                                    </label>

                                    <select
                                        style={{
                                            ...fieldStyle,
                                            borderColor: errors.reason
                                                ? "var(--danger)"
                                                : "var(--border)",
                                        }}
                                        value={reason}
                                        disabled={!policy}
                                        onChange={(e) => {
                                            setReason(e.target.value);

                                            setErrors((prev) => ({
                                                ...prev,
                                                reason: "",
                                            }));
                                        }}
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

                                    {errors.reason && (
                                        <p style={errorStyle}>
                                            {errors.reason}
                                        </p>
                                    )}
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
                                            ? `${policy.label} can be applied for immediately. Earliest start date: Today.`
                                            : `${policy.label} requires at least ${policy.noticeDays} days' notice. Earliest available start date is ${minimumStartDate}.`)}
                                </p>
                                {errors.leaveType && (
                                    <p style={errorStyle}>
                                        {errors.leaveType}
                                    </p>
                                )}

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
                                        style={{
                                            ...fieldStyle,
                                            borderColor: errors.startDate
                                                ? "var(--danger)"
                                                : "var(--border)",
                                        }}
                                        value={startDate}
                                        min={minimumStartDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);

                                            setErrors((prev) => ({
                                                ...prev,
                                                startDate: "",
                                            }));
                                        }}
                                    />

                                    {errors.startDate && (
                                        <p style={errorStyle}>
                                            {errors.startDate}
                                        </p>
                                    )}
                                </div>


                                <div>
                                    <label style={labelStyle}>
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        style={{
                                            ...fieldStyle,
                                            borderColor: errors.endDate
                                                ? "var(--danger)"
                                                : "var(--border)",
                                        }}
                                        value={endDate}
                                        min={startDate || minimumStartDate}
                                        onChange={(e) => {
                                            setEndDate(e.target.value);

                                            setErrors((prev) => ({
                                                ...prev,
                                                endDate: "",
                                            }));
                                        }}
                                    />

                                    {errors.endDate && (
                                        <p style={errorStyle}>
                                            {errors.endDate}
                                        </p>
                                    )}
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
                        </>

                    )}
                    {step === "summary" && (
                        <div
                            style={{
                                display: "grid",
                                gap: "18px",
                            }}
                        >
                            <div>
                                <h3
                                    style={{
                                        margin: 0,
                                        fontFamily: "var(--font-serif)",
                                    }}
                                >
                                    Review Leave Request
                                </h3>

                                <p
                                    style={{
                                        marginTop: "6px",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    Please review your leave request before submitting.
                                </p>
                            </div>

                            <div className="panel">
                                <div className="panel-body">

                                    <SummaryRow
                                        label="Leave Type"
                                        value={policy?.label || "-"}
                                    />

                                    <SummaryRow
                                        label="Reason"
                                        value={reason}
                                    />

                                    <SummaryRow
                                        label="Start Date"
                                        value={startDate}
                                    />

                                    <SummaryRow
                                        label="End Date"
                                        value={endDate}
                                    />

                                </div>
                            </div>
                        </div>
                    )}
                    {step === "success" && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "24px 0",
                                display: "grid",
                                gap: "16px",
                            }}
                        >
                            <div style={{ fontSize: "3rem" }}>
                                ✅
                            </div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontFamily: "var(--font-serif)",
                                }}
                            >
                                Leave Request Submitted
                            </h2>

                            <p
                                style={{
                                    color: "var(--text-secondary)",
                                    margin: 0,
                                }}
                            >
                                Your leave request has been submitted successfully.
                                <br />
                                It has been forwarded to your supervisor for review.
                            </p>
                        </div>
                    )}
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
                    {step === "form" && (
                        <>
                            <button
                                className="button button-secondary"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>

                            <button
                                className="button button-primary"
                                onClick={() => {
                                    if (validateForm()) {
                                        setStep("summary");
                                    }
                                }}
                            >
                                Review Request
                            </button>
                        </>
                    )}

                    {step === "summary" && (
                        <>
                            <button
                                className="button button-secondary"
                                onClick={() => setStep("form")}
                            >
                                Edit
                            </button>

                            <button
                                className="button button-primary"
                                onClick={() => {
                                    setStep("success");
                                }}
                            >
                                Submit Request
                            </button>
                        </>
                    )}

                    {step === "success" && (
                        <button
                            className="button button-primary"
                            onClick={handleClose}
                        >
                            Done
                        </button>
                    )}
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

const errorStyle = {
    color: "var(--danger)",
    fontSize: ".75rem",
    marginTop: "6px",
    marginBottom: 0,
};

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
                padding: "10px 0",
                borderBottom: "1px solid var(--border-subtle)",
            }}
        >
            <strong>{label}</strong>

            <span>{value}</span>
        </div>
    );
}