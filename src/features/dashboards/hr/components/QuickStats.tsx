interface QuickStatsProps {
  stats: { label: string; value: string | number }[];
}

export const QuickStats = ({ stats }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-lg font-bold text-gray-900">{stat.value}</p>
          <p className="text-[10px] text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};
