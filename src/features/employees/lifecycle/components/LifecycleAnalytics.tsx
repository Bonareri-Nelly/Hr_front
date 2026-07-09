import { TrendingUp, Users, Clock, BarChart3, Building2, Calendar } from 'lucide-react';

interface AnalyticsData {
  avgTimeToPromotion: string;
  avgTenure: string;
  attritionByStage: { stage: string; percentage: number }[];
  onboardingCompletionRate: number;
  timeToProductivity: string;
}

interface LifecycleAnalyticsProps {
  data: AnalyticsData;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

export const LifecycleAnalytics = ({ data, dateRange, setDateRange }: LifecycleAnalyticsProps) => {
  const metrics = [
    {
      label: 'Avg Time to Promotion',
      value: data.avgTimeToPromotion,
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Avg Tenure',
      value: data.avgTenure,
      icon: Clock,
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Onboarding Completion',
      value: `${data.onboardingCompletionRate}%`,
      icon: Users,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Time to Productivity',
      value: data.timeToProductivity,
      icon: BarChart3,
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  const attritionColors = {
    '0-6 months': 'bg-red-500',
    '6-12 months': 'bg-orange-500',
    '1-3 years': 'bg-yellow-500',
    '3+ years': 'bg-green-500',
  };

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Date Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-700"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-700"
            />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <metric.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p className="text-xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attrition Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-700" />
          Attrition by Stage
        </h3>
        <div className="space-y-3">
          {data.attritionByStage.map((item) => {
            const color = attritionColors[item.stage as keyof typeof attritionColors] || 'bg-gray-500';
            return (
              <div key={item.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.stage}</span>
                  <span className="text-gray-500">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};