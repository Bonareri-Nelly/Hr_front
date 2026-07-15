import { useMemo, useState } from "react";
import { mockEmployees } from "../data/mockEmployees";

type ReplacementSelectorProps = {
  applierDepartment: string;
  selectedEmployeeId: string | null;
  onSelect: (employeeId: string) => void;
};

export default function ReplacementSelector({
  applierDepartment,
  selectedEmployeeId,
  onSelect,
}: ReplacementSelectorProps) {
  const [query, setQuery] = useState("");

  const employeesInDept = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockEmployees
      .filter((e) => e.department === applierDepartment)
      .filter((e) => (q ? `${e.name}`.toLowerCase().includes(q) : true));
  }, [applierDepartment, query]);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <label style={labelStyle}>Select replacement employee</label>

      <input
        style={fieldStyle}
        placeholder="Search by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{ display: "grid", gap: 8, maxHeight: 220, overflowY: "auto" }}>
        {employeesInDept.length === 0 ? (
          <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>
            No employees found in {applierDepartment}.
          </div>
        ) : (
          employeesInDept.map((emp) => (
            <button
              key={emp.id}
              className="button"
              style={{
                justifyContent: "flex-start",
                borderColor:
                  selectedEmployeeId === emp.id
                    ? "var(--primary)"
                    : "var(--border)",
                background:
                  selectedEmployeeId === emp.id
                    ? "var(--primary-bg)"
                    : "var(--surface)",
                padding: "10px 12px",
              }}
              onClick={() => onSelect(emp.id)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <strong style={{ fontSize: ".9rem" }}>{emp.name}</strong>
                <span style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>
                  {emp.department}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: ".8rem",
  fontWeight: 600,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  background: "var(--surface)",
  color: "var(--ink)",
  fontSize: ".8rem",
  boxSizing: "border-box",
  outline: "none",
};
