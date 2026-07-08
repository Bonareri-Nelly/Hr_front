export const QuickStats = () => {
  const stats = [
    { label: 'Total Departments', value: '12' },
    { label: 'Branches', value: '6' },
    { label: 'Avg. Tenure', value: '4.2 yrs' },
    { label: 'Turnover Rate', value: '8.5%' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-lg font-bold text-gray-900">{stat.value}</p>  {/* was text-xl */}
          <p className="text-[10px] text-gray-500">{stat.label}</p>  {/* was text-xs */}
        </div>
      ))}
    </div>
  );
};