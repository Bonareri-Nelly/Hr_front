import { Star, TrendingUp } from 'lucide-react';

interface PerformanceData {
  overallAvg: number;
  trend: { cycle: string; avgScore: number }[];
}

export const PerformanceSnapshot = ({ data }: { data: PerformanceData }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-blue-700" />
          Performance Snapshot
        </h3>
        <div className="text-right">
          <p className="text-xs text-gray-500">Avg Rating</p>
          <p className="text-xl font-bold text-blue-700">{data.overallAvg.toFixed(1)}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-3">Trend Over Review Cycles</p>
        <div className="flex items-end gap-3 h-24">
          {data.trend.map((item, idx) => {
            const height = (item.avgScore / 5) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-200 to-blue-400 rounded-t"
                  style={{ height: `${Math.max(height * 0.8, 10)}px` }}
                />
                <span className="text-[10px] text-gray-500 mt-1">{item.cycle}</span>
                <span className="text-[10px] text-gray-600">{item.avgScore.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};