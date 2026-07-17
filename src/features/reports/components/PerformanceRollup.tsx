import { useState } from 'react';
import { Star, X } from 'lucide-react';

interface PerformanceData {
  distribution: { rating: string; count: number; percentage: number }[];
  departmentComparison: { department: string; avgScore: number }[];
  trend: { cycle: string; avgScore: number }[];
  overallAvg: number;
}

export const PerformanceRollup = ({ data }: { data: PerformanceData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-700" />
              Performance Rollup
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Company-wide performance ratings and department comparison
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-blue-700 hover:text-blue-800 transition"
          >
            View Details →
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">Overall Average</span>
          <span className="text-xl font-bold text-amber-600">{data.overallAvg.toFixed(1)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-3">Department Comparison</p>
            <div className="space-y-3">
              {data.departmentComparison.map((dept) => (
                <div key={dept.department} className="flex justify-between items-center text-xs">
                  <span className="text-gray-700">{dept.department}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
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

        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-3">Performance Trend</p>
          <div className="flex items-end gap-4 h-20">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-6 h-6 text-blue-700" />
                Performance – Full Details
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Overall Avg</p>
                <p className="text-2xl font-bold text-amber-600">{data.overallAvg.toFixed(1)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{data.distribution.reduce((sum, d) => sum + d.count, 0)}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">All Department Scores</p>
              {data.departmentComparison.map((dept) => (
                <div key={dept.department} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                  <span className="text-sm">{dept.department}</span>
                  <span className="text-sm font-medium">{dept.avgScore.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};