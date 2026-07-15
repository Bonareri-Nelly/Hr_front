interface WorkflowProgressProps {
    currentStep: number;
}

const steps = [
    "Schedule Hearing",
    "Review Schedule",
    "Conduct Hearing",
    "Decision",
];

const WorkflowProgress = ({ currentStep }: WorkflowProgressProps) => {
    return (
        <section
            className="rounded-xl border p-5"
            style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
            }}
        >
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const active = stepNumber <= currentStep;

                    return (
                        <div
                            key={step}
                            className="flex flex-1 items-center"
                        >
                            <div className="flex flex-col items-center">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition"
                                    style={{
                                        backgroundColor: active
                                            ? "var(--navy-dark)"
                                            : "var(--border)",
                                        color: active
                                            ? "white"
                                            : "var(--text-secondary)",
                                    }}
                                >
                                    {stepNumber}
                                </div>

                                <p
                                    className="mt-2 text-center text-xs"
                                    style={{
                                        color: active
                                            ? "var(--ink)"
                                            : "var(--text-muted)",
                                    }}
                                >
                                    {step}
                                </p>
                            </div>

                            {index !== steps.length - 1 && (
                                <div
                                    className="mx-3 h-1 flex-1 rounded-full"
                                    style={{
                                        backgroundColor:
                                            stepNumber < currentStep
                                                ? "var(--navy-dark)"
                                                : "var(--border)",
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default WorkflowProgress;