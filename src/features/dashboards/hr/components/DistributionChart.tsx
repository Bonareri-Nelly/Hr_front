const data = [
  { label: 'Nairobi', value: 420, color: 'bg-blue-500' },
  { label: 'Mombasa', value: 310, color: 'bg-green-500' },
  { label: 'Kisumu', value: 280, color: 'bg-yellow-500' },
  { label: 'Remote', value: 238, color: 'bg-purple-500' },
];

export const DistributionChart = () => {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">Employee Distribution</h3>
      <div className="space-y-2">
        {data.map((item) => (
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