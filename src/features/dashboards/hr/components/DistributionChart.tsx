interface DistributionChartProps {
  branches?: { name: string; employees: number; amount?: string; status?: string }[];
}

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-pink-500',
];

export const DistributionChart = ({ branches = [] }: DistributionChartProps) => {
  if (!branches || branches.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Employee Distribution</h3>
        <div className="text-center py-8 text-gray-500 text-sm">
          No distribution data available
        </div>
      </div>
    );
  }

  const max = Math.max(...branches.map((b) => b.employees));

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">Employee Distribution</h3>
      <div className="space-y-2">
        {branches.map((item, index) => (
          <div key={item.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{item.name}</span>
              <span className="font-medium text-gray-800">{item.employees}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${(item.employees / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};