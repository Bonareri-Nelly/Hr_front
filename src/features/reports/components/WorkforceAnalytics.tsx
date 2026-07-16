import { Users, TrendingUp, TrendingDown, UserPlus, UserMinus, Clock } from 'lucide-react';

interface WorkforceData {
  headcount: { month: string; total: number; newHires: number; exits: number }[];
  turnover: { rate: number; trend: string };
  tenure: { average: number; distribution: { label: string; value: number }[] };
  departments: { name: string; headcount: number; spanOfControl: number }[];
  diversity: { category: string; count: number; percentage: number }[];
}

export const WorkforceAnalytics = ({ data }: { data: WorkforceData }) => {
  const stats = [
    { label: 'Total Headcount', value: data.headcount[data.headcount.length - 1]?.total || 0, icon: Users, color: 'blue' },
    { label: 'New Hires', value: data.headcount.reduce((sum, m) => sum + m.newHires, 0), icon: UserPlus, color: 'green' },
    { label: 'Exits', value: data.headcount.reduce((sum, m) => sum + m.exits, 0), icon: UserMinus, color: 'red' },
    { label: 'Turnover Rate', value: data.turnover.rate + '%', icon: TrendingUp, color: 'orange' },
    { label: 'Avg Tenure', value: data.tenure.average + ' yrs', icon: Clock, color: 'purple' },
  ]; 

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />  {/* Changed to blue-700 */}
            Workforce Analytics
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Headcount trends, turnover, and organizational structure
          </p>
        </div>
        <button className="text-sm text-blue-700 hover:text-blue-800 transition">
          View Details →
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {stats.map((stat) => {
          const colors = {
            blue: 'bg-blue-50 text-blue-700',
            green: 'bg-green-50 text-green-600',
            red: 'bg-red-50 text-red-600',
            orange: 'bg-orange-50 text-orange-600',
            purple: 'bg-purple-50 text-purple-600',
          };
          return (
            <div key={stat.label} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${colors[stat.color as keyof typeof colors]}`}>
                  <stat.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Headcount Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-3">Headcount Trend (Last 6 Months)</p>
        <div className="flex items-end gap-2 h-32">
          {data.headcount.slice(-6).map((item, idx) => {
            const max = Math.max(...data.headcount.map((d) => d.total));
            const height = (item.total / max) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-300 rounded-t hover:bg-blue-400 transition"  // Changed to blue
                  style={{ height: `${Math.max(height * 0.7, 10)}px` }}
                />
                <span className="text-[10px] text-gray-500 mt-1">{item.month.slice(0, 3)}</span>
                <span className="text-[10px] text-gray-600">{item.total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Table */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">Department Headcount</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs text-gray-500 py-2 font-medium">Department</th>
                <th className="text-right text-xs text-gray-500 py-2 font-medium">Headcount</th>
                <th className="text-right text-xs text-gray-500 py-2 font-medium">Span of Control</th>
              </tr>
            </thead>
            <tbody>
              {data.departments.map((dept) => (
                <tr key={dept.name} className="border-b border-gray-100 last:border-0">
                  <td className="text-left text-xs text-gray-700 py-2">{dept.name}</td>
                  <td className="text-right text-xs text-gray-700 py-2">{dept.headcount}</td>
                  <td className="text-right text-xs text-gray-700 py-2">{dept.spanOfControl}:1</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};