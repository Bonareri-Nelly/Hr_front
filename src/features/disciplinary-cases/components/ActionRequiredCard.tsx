import { useState } from "react";
import type { DisciplinaryCase } from "../types";

interface Props {
    caseData: DisciplinaryCase;
}

const ActionRequiredCard = ({ caseData }: Props) => {
    const [view, setView] = useState<"summary" | "schedule">("summary");

    const getDescription = () => {
        switch (caseData.status) {
            case "Pending Review":
                return "This case has been escalated to HR. Schedule a disciplinary hearing to begin the investigation.";

            case "Hearing Scheduled":
                return "The hearing has been scheduled. Review the details or reschedule if necessary.";

            case "Hearing In Progress":
                return "The hearing is currently in progress. Record evidence, notes and the final decision.";

            case "Decision Issued":
                return "The disciplinary decision has been recorded. Await an appeal or close the case.";

            case "Appealed":
                return "The employee has appealed the decision. Await the Branch Manager's review.";

            case "Appeal Decided":
                return "The appeal has been concluded. Review the final outcome.";

            case "Closed":
                return "This case has been closed and is now available for reporting and auditing.";

            default:
                return "";
        }
    };

    return (
        <section
            className="rounded-xl border p-5"
            style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
            }}
        >
            {view === "summary" ? (
                <>
                    <h3
                        className="text-lg font-semibold"
                        style={{
                            color: "var(--ink)",
                            fontFamily: "var(--font-serif)",
                        }}
                    >
                        Action Required
                    </h3>

                    <div
                        className="mt-4 rounded-xl border p-5"
                        style={{
                            borderColor: "var(--border-subtle)",
                            backgroundColor: "var(--background)",
                        }}
                    >
                        <p
                            className="text-xs uppercase tracking-wide"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Current Stage
                        </p>

                        <h4
                            className="mt-1 text-lg font-semibold"
                            style={{ color: "var(--ink)" }}
                        >
                            {caseData.status}
                        </h4>

                        <p
                            className="mt-4 leading-7"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {getDescription()}
                        </p>

                        <button
                            onClick={() => setView("schedule")}
                            className="mt-6 w-full rounded-lg py-3 font-medium transition"
                            style={{
                                backgroundColor: "var(--navy-dark)",
                                color: "white",
                            }}
                        >
                            {caseData.nextAction}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <button
                        onClick={() => setView("summary")}
                        className="mb-5 text-sm font-medium transition"
                        style={{ color: "var(--navy-dark)" }}
                    >
                        ← Back
                    </button>

                    <h3
                        className="text-lg font-semibold"
                        style={{
                            color: "var(--ink)",
                            fontFamily: "var(--font-serif)",
                        }}
                    >
                        Schedule Hearing
                    </h3>

                    <div className="mt-6 space-y-4">

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Hearing Date
                            </label>

                            <input
                                type="date"
                                className="w-full rounded-lg border p-3"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Hearing Time
                            </label>

                            <input
                                type="time"
                                className="w-full rounded-lg border p-3"
                            />
                        </div>

                        <div
                            className="rounded-xl border border-dashed p-4"
                            style={{
                                borderColor: "var(--gold)",
                                backgroundColor: "var(--gold-light)",
                            }}
                        >
                            <strong>Calendar Availability</strong>

                            <p className="mt-2 text-sm">
                                Calendar integration will appear here.
                            </p>

                            <p className="mt-1 text-sm">
                                • Detect overlapping hearings
                            </p>

                            <p className="text-sm">
                                • Warn if a day has too many hearings
                            </p>

                            <p className="text-sm">
                                • Show available hearing slots
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Venue
                            </label>

                            <input
                                type="text"
                                placeholder="Boardroom A"
                                className="w-full rounded-lg border p-3"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Platform
                            </label>

                            <select
                                className="w-full rounded-lg border p-3"
                            >
                                <option>Physical</option>
                                <option>Microsoft Teams</option>
                                <option>Google Meet</option>
                                <option>Zoom</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                HR Notes
                            </label>

                            <textarea
                                rows={4}
                                className="w-full rounded-lg border p-3"
                            />
                        </div>

                        <button
                            className="w-full rounded-lg py-3 font-medium"
                            style={{
                                backgroundColor: "var(--navy-dark)",
                                color: "white",
                            }}
                        >
                            Save Hearing
                        </button>
                    </div>
                </>
            )}
        </section>
    );
};

export default ActionRequiredCard;