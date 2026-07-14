interface DistributionChartProps {
  branch: string;
}

export const DistributionChart = ({ branch }: DistributionChartProps) => {
  const data = {
    'Nairobi HQ': [
      { label: 'Engineering', value: 156, color: 'bg-blue-500' },
      { label: 'Finance', value: 89, color: 'bg-green-500' },
      { label: 'HR', value: 34, color: 'bg-yellow-500' },
      { label: 'Sales', value: 112, color: 'bg-purple-500' },
      { label: 'Operations', value: 29, color: 'bg-red-500' },
    ],
    'Mombasa': [
      { label: 'Sales', value: 85, color: 'bg-purple-500' },
      { label: 'Operations', value: 120, color: 'bg-red-500' },
      { label: 'Customer Support', value: 65, color: 'bg-indigo-500' },
      { label: 'Logistics', value: 40, color: 'bg-pink-500' },
    ],
  };

  const branchData = data[branch] || data['Nairobi HQ'];
  const max = Math.max(...branchData.map((d) => d.value));

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">Employee Distribution</h3>
      <div className="space-y-2">
        {branchData.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-800">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${item.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};