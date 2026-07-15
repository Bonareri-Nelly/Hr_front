import type { DisciplinaryCase } from "../types";

interface WorkflowWorkspaceProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    caseData: DisciplinaryCase;
}

const WorkflowWorkspace = ({
    currentStep,
    setCurrentStep,
    caseData,
}: WorkflowWorkspaceProps) => {
    switch (currentStep) {
        case 1:
            return (
                <section
                    className="rounded-xl border p-5"
                    style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--surface)",
                    }}
                >
                    <h3
                        className="text-lg font-semibold"
                        style={{
                            color: "var(--ink)",
                            fontFamily: "var(--font-serif)",
                        }}
                    >
                        Step 1: Hearing Setup
                    </h3>

                    <p
                        className="mt-3"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Schedule a disciplinary hearing for{" "}
                        <strong>{caseData.employee}</strong>.
                    </p>

                    <div className="mt-8 flex justify-end">

                        <button
                            onClick={() => setCurrentStep(2)}
                            className="rounded-lg px-6 py-3 font-medium transition"
                            style={{
                                backgroundColor: "var(--navy-dark)",
                                color: "white",
                            }}
                        >
                            Continue →
                        </button>

                    </div>
                </section>
            );

        case 2:
            return (
                <div>
                    <h3>Step 2 - Review Schedule</h3>
                </div>
            );

        case 3:
            return (
                <div>
                    <h3>Step 3 - Conduct Hearing</h3>
                </div>
            );

        case 4:
            return (
                <div>
                    <h3>Step 4 - Decision</h3>
                </div>
            );

        default:
            return null;
    }
};

export default WorkflowWorkspace;