const cards = [
  {
    title: "Pending Reviews",
    value: 8,
    accent: "var(--warning)",
  },
  {
    title: "Hearings Today",
    value: 3,
    accent: "var(--gold)",
  },
  {
    title: "Under Investigation",
    value: 5,
    accent: "var(--info)",
  },
  {
    title: "Appeals Pending",
    value: 2,
    accent: "var(--danger)",
  },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border p-5 transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {/* Accent Line */}
          <div
            className="mb-4 h-1 w-12 rounded-full"
            style={{ backgroundColor: card.accent }}
          />

          {/* Title */}
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {card.title}
          </p>

          {/* Value */}
          <h2
            className="mt-2 text-3xl font-bold"
            style={{ color: "var(--ink)" }}
          >
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;