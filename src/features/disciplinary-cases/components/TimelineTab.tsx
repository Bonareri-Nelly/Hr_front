const TimelineTab = () => {
    return (
        <section
            className="rounded-xl border p-5"
            style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
            }}
        >
            <h3
                className="mb-4 text-lg font-semibold"
                style={{
                    color: "var(--ink)",
                    fontFamily: "var(--font-serif)",
                }}
            >
                Activity Timeline
            </h3>

            <div className="space-y-3 text-sm">
                <p>• Complaint Submitted</p>
                <p>• Escalated to HR</p>
            </div>
        </section>
    );
};

export default TimelineTab;