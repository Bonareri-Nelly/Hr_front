import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface PayrollData {
  trend: { month: string; amount: number }[];
  breakdown: { category: string; amount: number; percentage: number }[];
  budget: { actual: number; budget: number; variance: number };
}

export const PayrollOverview = ({ data }: { data: PayrollData }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalPayroll = data.trend[data.trend.length - 1]?.amount || 0;
  const isVariancePositive = data.budget.variance > 0;

  const stats = [
    { 
      label: 'Total Payroll', 
      value: formatCurrency(totalPayroll), 
      icon: DollarSign, 
      color: 'blue' 
    },
    { 
      label: 'Budget Variance', 
      value: isVariancePositive ? `+${formatCurrency(data.budget.variance)}` : formatCurrency(data.budget.variance), 
      icon: isVariancePositive ? TrendingUp : TrendingDown, 
      color: isVariancePositive ? 'green' : 'red' 
    },
  ];

  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  const maxAmount = Math.max(...data.trend.map(d => d.amount));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-700" />
            Payroll Overview
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Branch payroll costs and budget comparison
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

      {/* Payroll Trend Chart */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-xs text-gray-500 mb-3">Payroll Trend</p>
        <div className="flex items-end gap-2 h-32">
          {data.trend.map((item, idx) => {
            const height = (item.amount / maxAmount) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-200 to-blue-400 rounded-t"
                  style={{ height: `${Math.max(height * 0.8, 10)}px` }}
                />
                <span className="text-[10px] text-gray-500 mt-1">{item.month.slice(0, 3)}</span>
                <span className="text-[10px] text-gray-600">{formatCurrency(item.amount).replace('KES', '')}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-3">Cost Breakdown</p>
        <div className="space-y-2">
          {data.breakdown.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between text-xs">
                <span className="text-gray-700">{item.category}</span>
                <span className="text-gray-500">{item.percentage}%</span>
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
    </div>
  );
};