import { Gift, TrendingUp, Users, PieChart } from 'lucide-react';

interface BenefitsData {
  summary: { category: string; utilization: number; cost: number; eligible: number }[];
  totalCost: number;
  avgUtilization: number;
}

export const BenefitsUtilization = ({ data }: { data: BenefitsData }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-700" />  {/* Changed to blue-700 */}
            Benefits Utilization
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Company-wide benefits usage and costs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Cost</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(data.totalCost)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Avg Utilization</p>
            <p className="text-lg font-bold text-green-600">{data.avgUtilization}%</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.summary.map((item) => {
          const width = Math.min((item.utilization / 100) * 100, 100);
          const color = item.utilization > 70 ? 'green' : item.utilization > 40 ? 'yellow' : 'blue';
          const colorClasses = {
            green: 'bg-green-500',
            yellow: 'bg-yellow-500',
            blue: 'bg-blue-600',
          };
          return (
            <div key={item.category} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.category}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">{item.eligible} eligible</span>
                    <span className="text-xs text-gray-500">{formatCurrency(item.cost)}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.utilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};