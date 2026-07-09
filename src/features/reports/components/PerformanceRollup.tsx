import { TrendingUp, Star, Users, BarChart3 } from 'lucide-react';

interface PerformanceData {
  distribution: { rating: string; count: number; percentage: number }[];
  departmentComparison: { department: string; avgScore: number }[];
  trend: { cycle: string; avgScore: number }[];
  overallAvg: number;
}

export const PerformanceRollup = ({ data }: { data: PerformanceData }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-700" />  {/* Changed to blue-700 */}
            Performance Rollup
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Company-wide performance ratings and department comparison
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Overall Avg</p>
            <p className="text-xl font-bold text-blue-700">{data.overallAvg.toFixed(1)}</p>  {/* Changed to blue-700 */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-3">Rating Distribution</p>
          <div className="space-y-2">
            {data.distribution.map((item) => (
              <div key={item.rating}>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700">{item.rating}</span>
                  <span className="text-gray-500">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"  // Changed to blue-600
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Comparison */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-3">Department Comparison</p>
          <div className="space-y-3">
            {data.departmentComparison.map((dept) => (
              <div key={dept.department} className="flex justify-between items-center text-xs">
                <span className="text-gray-700">{dept.department}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"  // Changed to blue-600
                      style={{ width: `${(dept.avgScore / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-600 font-medium">{dept.avgScore.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-3">Performance Trend</p>
        <div className="flex items-end gap-4 h-20">
          {data.trend.map((item, idx) => {
            const height = (item.avgScore / 5) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-200 to-blue-400 rounded-t"  // Changed to blue
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