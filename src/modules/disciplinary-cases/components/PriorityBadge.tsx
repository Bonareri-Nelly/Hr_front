interface PriorityBadgeProps {
  priority: "Major" | "Minor";
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const isMajor = priority === "Major";

  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: isMajor
          ? "var(--danger-bg)"
          : "var(--warning-bg)",
        color: isMajor
          ? "var(--danger)"
          : "var(--warning)",
      }}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;