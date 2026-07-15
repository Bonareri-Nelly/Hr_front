import { CalendarPlus } from "lucide-react";

const awaitingCases = [
  {
    id: "DC-2026-001",
    employee: "John Smith",
    complaint: "Workplace Harassment",
  },
  {
    id: "DC-2026-004",
    employee: "Alice Njeri",
    complaint: "Fraud Allegation",
  },
];

const AwaitingHearings = () => {
  return (
    <div
      className="rounded-xl border p-6"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mb-5">
        <h2
          className="text-xl font-semibold"
          style={{
            color: "var(--ink)",
            fontFamily: "var(--font-serif)",
          }}
        >
          Awaiting Hearing Scheduling
        </h2>

        <p
          className="mt-1 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Major disciplinary cases waiting for HR to schedule a hearing.
        </p>
      </div>

      <div className="space-y-3">
        {awaitingCases.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border p-4"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <div>
              <h3
                className="font-semibold"
                style={{ color: "var(--ink)" }}
              >
                {item.id}
              </h3>

              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.employee}
              </p>

              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.complaint}
              </p>
            </div>

            <button
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition"
              style={{
                backgroundColor: "var(--gold)",
                color: "white",
              }}
            >
              <CalendarPlus size={18} />
              Schedule Hearing
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AwaitingHearings;