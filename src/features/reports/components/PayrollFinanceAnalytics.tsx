import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';

interface PayrollData {
  total: { month: string; amount: number }[];
  breakdown: { category: string; amount: number; percentage: number }[];
  budget: { actual: number; budget: number; variance: number };
  branchComparison: { branch: string; totalPayroll: number; avgPerEmployee: number }[];
}

export const PayrollFinanceAnalytics = ({ data }: { data: PayrollData }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const stats = [
    { 
      label: 'Total Payroll', 
      value: formatCurrency(data.budget.actual), 
      icon: DollarSign, 
      color: 'blue'  // Changed to blue
    },
    { 
      label: 'Budget Variance', 
      value: data.budget.variance > 0 ? `+${formatCurrency(data.budget.variance)}` : formatCurrency(data.budget.variance), 
      icon: data.budget.variance > 0 ? TrendingUp : TrendingDown, 
      color: data.budget.variance > 0 ? 'green' : 'red'
    },
    { 
      label: 'Avg Salary per Employee', 
      value: formatCurrency(data.branchComparison.reduce((sum, b) => sum + b.avgPerEmployee, 0) / data.branchComparison.length), 
      icon: BarChart3, 
      color: 'blue'  // Changed to blue
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-700" />  {/* Changed to blue-700 */}
            Payroll & Finance Analytics
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Company-wide payroll costs, budget comparison, and branch analysis
          </p>
        </div>
        <button className="text-sm text-blue-700 hover:text-blue-800 transition">
          View Details →
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => {
          const colors = {
            blue: 'bg-blue-50 text-blue-700',
            green: 'bg-green-50 text-green-600',
            red: 'bg-red-50 text-red-600',
          };
          return (
            <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${colors[stat.color as keyof typeof colors]}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Payroll Trend Chart */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-xs text-gray-500 mb-3">Payroll Cost Trend (Monthly)</p>
        <div className="flex items-end gap-2 h-40">
          {data.total.map((item, idx) => {
            const max = Math.max(...data.total.map((d) => d.amount));
            const height = (item.amount / max) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-200 to-blue-400 rounded-t"  // Changed to blue
                  style={{ height: `${Math.max(height * 0.8, 10)}px` }}
                />
                <span className="text-[10px] text-gray-500 mt-1">{item.month.slice(0, 3)}</span>
                <span className="text-[10px] text-gray-600">{formatCurrency(item.amount).replace('KES', '')}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown + Branch Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="bg-blue-600 h-1.5 rounded-full"  // Changed to blue-600
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-3">Branch Comparison</p>
          <div className="space-y-3">
            {data.branchComparison.map((branch) => (
              <div key={branch.branch} className="flex justify-between items-center text-xs">
                <span className="text-gray-700">{branch.branch}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{formatCurrency(branch.totalPayroll)}</span>
                  <span className="text-gray-400">({formatCurrency(branch.avgPerEmployee)}/emp)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};