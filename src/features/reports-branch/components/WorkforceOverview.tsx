import { Users, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface WorkforceData {
  headcountTrend: { month: string; total: number; newHires: number; exits: number }[];
  averageTenure: number;
  turnoverRate: number;
}

export const WorkforceOverview = ({ data }: { data: WorkforceData }) => {
  const stats = [
    { label: 'Avg Tenure', value: data.averageTenure + ' yrs', icon: Clock, color: 'blue' },
    { label: 'Turnover Rate', value: data.turnoverRate + '%', icon: TrendingUp, color: data.turnoverRate < 10 ? 'green' : 'orange' },
  ];

  const colors = {
    blue: 'bg-blue-50 text-blue-700', 
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const maxHeadcount = Math.max(...data.headcountTrend.map(d => d.total));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            Workforce Overview
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Branch headcount trends and workforce metrics
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${colors[stat.color as keyof typeof colors]}`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Headcount Trend Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-3">Headcount Trend</p>
        <div className="flex items-end gap-2 h-32">
          {data.headcountTrend.map((item, idx) => {
            const height = (item.total / maxHeadcount) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex items-end gap-1" style={{ height: '100%' }}>
                  {/* New Hires (green) */}
                  <div
                    className="flex-1 bg-green-400 rounded-t"
                    style={{ height: `${(item.newHires / maxHeadcount) * 100}%` }}
                  />
                  {/* Exits (red) */}
                  <div
                    className="flex-1 bg-red-400 rounded-t"
                    style={{ height: `${(item.exits / maxHeadcount) * 100}%` }}
                  />
                  {/* Total (blue) */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-400/30 rounded-t"
                    style={{ height: `${Math.max(height * 0.7, 10)}px` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-1">{item.month.slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 mt-3">
          <span className="text-[10px] flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-400/50 rounded"></span>
            Total
          </span>
          <span className="text-[10px] flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded"></span>
            New Hires
          </span>
          <span className="text-[10px] flex items-center gap-1">
            <span className="w-2 h-2 bg-red-400 rounded"></span>
            Exits
          </span>
        </div>
      </div>
    </div>
  );
};