import type { DisciplinaryCase } from "../types";

interface CaseSummaryCardProps {
    caseData: DisciplinaryCase;
}

const CaseSummaryCard = ({ caseData }: CaseSummaryCardProps) => {
    return (
        <section
            className="rounded-xl border"
            style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
            }}
        >
            {/* Header */}
            <div
                className="border-b px-6 py-4"
                style={{ borderColor: "var(--border)" }}
            >
                <h3
                    className="text-lg font-semibold"
                    style={{
                        color: "var(--ink)",
                        fontFamily: "var(--font-serif)",
                    }}
                >
                    Case Summary
                </h3>

                <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                >
                    Basic information about this disciplinary case.
                </p>
            </div>

            {/* Body */}
            <div className="grid grid-cols-2 gap-6 p-6">

                <div>
                    <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Case ID
                    </p>

                    <p
                        className="mt-1 font-medium"
                        style={{ color: "var(--ink)" }}
                    >
                        {caseData.id}
                    </p>
                </div>

                <div>
                    <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Complaint ID
                    </p>

                    <p
                        className="mt-1 font-medium"
                        style={{ color: "var(--ink)" }}
                    >
                        {caseData.complaintId}
                    </p>
                </div>

                <div>
                    <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Defendant
                    </p>

                    <p
                        className="mt-1 font-medium"
                        style={{ color: "var(--ink)" }}
                    >
                        {caseData.employee}
                    </p>
                </div>

                <div>
                    <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Department
                    </p>

                    <p
                        className="mt-1 font-medium"
                        style={{ color: "var(--ink)" }}
                    >
                        {caseData.department}
                    </p>
                </div>

                <div className="col-span-2">
                    <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Complaint
                    </p>

                    <p
                        className="mt-1"
                        style={{ color: "var(--ink)" }}
                    >
                        {caseData.complaint}
                    </p>
                </div>

                <div>
                    <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Priority
                    </p>

                    <span
                        className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium"
                        style={{
                            backgroundColor:
                                caseData.priority === "Major"
                                    ? "var(--danger-bg)"
                                    : "var(--warning-bg)",
                            color:
                                caseData.priority === "Major"
                                    ? "var(--danger)"
                                    : "var(--warning)",
                        }}
                    >
                        {caseData.priority}
                    </span>
                </div>

                <div>
                    <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Current Owner
                    </p>

                    <p
                        className="mt-1 font-medium"
                        style={{ color: "var(--ink)" }}
                    >
                        {caseData.assignedTo}
                    </p>
                </div>

                <div className="col-span-2">
                    <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Status
                    </p>

                    <span
                        className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium"
                        style={{
                            backgroundColor: "var(--info-bg)",
                            color: "var(--info)",
                        }}
                    >
                        {caseData.status}
                    </span>
                </div>

            </div>
        </section>
    );
};

export default CaseSummaryCard;