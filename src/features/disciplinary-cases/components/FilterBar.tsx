const FilterBar = () => {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by Case ID, Employee or Complaint..."
          className="flex-1 rounded-lg border px-4 py-2.5 outline-none"
          style={{
            borderColor: "var(--border)",
            color: "var(--ink)",
            backgroundColor: "var(--surface)",
          }}
        />

        {/* Department */}
        <select
          className="rounded-lg border px-4 py-2.5 outline-none"
          style={{
            borderColor: "var(--border)",
            color: "var(--ink)",
            backgroundColor: "var(--surface)",
          }}
        >
          <option>Department</option>
        </select>

        {/* Priority */}
        <select
          className="rounded-lg border px-4 py-2.5 outline-none"
          style={{
            borderColor: "var(--border)",
            color: "var(--ink)",
            backgroundColor: "var(--surface)",
          }}
        >
          <option>Priority</option>
          <option>Major</option>
          <option>Minor</option>
        </select>

        {/* Status */}
        <select
          className="rounded-lg border px-4 py-2.5 outline-none"
          style={{
            borderColor: "var(--border)",
            color: "var(--ink)",
            backgroundColor: "var(--surface)",
          }}
        >
          <option>Status</option>
        </select>

        {/* Reset */}
        <button
          className="rounded-lg px-5 py-2.5 font-medium transition"
          style={{
            backgroundColor: "var(--navy-dark)",
            color: "white",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;