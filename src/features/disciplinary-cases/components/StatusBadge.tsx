interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<
  string,
  { background: string; color: string }
> = {
  "Pending Review": {
    background: "var(--warning-bg)",
    color: "var(--warning)",
  },
  "Under Investigation": {
    background: "var(--info-bg)",
    color: "var(--info)",
  },
  "Hearing Scheduled": {
    background: "var(--gold-light)",
    color: "var(--gold)",
  },
  "Decision Issued": {
    background: "var(--success-bg)",
    color: "var(--success)",
  },
  Appealed: {
    background: "var(--danger-bg)",
    color: "var(--danger)",
  },
  Closed: {
    background: "var(--border-subtle)",
    color: "var(--text-secondary)",
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const style =
    statusStyles[status] ?? {
      background: "var(--background)",
      color: "var(--ink)",
    };

  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: style.background,
        color: style.color,
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;