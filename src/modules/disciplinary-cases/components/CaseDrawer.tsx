import type { DisciplinaryCase } from "../types";

import CaseSummaryCard from "./CaseSummaryCard";
import HearingTab from "./HearingTab";
import TimelineTab from "./TimelineTab";

interface CaseDrawerProps {
    caseData: DisciplinaryCase;
    onClose: () => void;
}

const CaseDrawer = ({ caseData, onClose }: CaseDrawerProps) => {
    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">

            <div
                className="h-full w-full max-w-4xl overflow-y-auto border-l shadow-xl"
                style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                }}
            >

                {/* Header */}

                <div
                    className="sticky top-0 z-20 border-b px-6 py-5"
                    style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                    }}
                >
                    <div className="flex items-center justify-between">

                        <div>

                            <h2
                                className="text-2xl font-semibold"
                                style={{
                                    color: "var(--ink)",
                                    fontFamily: "var(--font-serif)",
                                }}
                            >
                                {caseData.id}
                            </h2>

                            <p
                                className="mt-1"
                                style={{
                                    color: "var(--text-secondary)",
                                }}
                            >
                                {caseData.complaint}
                            </p>

                        </div>

                        <button
                            onClick={onClose}
                            className="rounded-lg px-3 py-2 transition"
                            style={{
                                border: "1px solid var(--border)",
                            }}
                        >
                            ✕
                        </button>

                    </div>

                </div>

                {/* Body */}

                <div className="space-y-6 p-6">

                    <CaseSummaryCard caseData={caseData} />

                    <HearingTab caseData={caseData} />

                    <TimelineTab />

                </div>

            </div>

        </div>
    );
};

export default CaseDrawer;