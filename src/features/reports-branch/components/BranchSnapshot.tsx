import { Users, UserPlus, UserMinus, DollarSign, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

interface SnapshotData {
  headcount: number;
  newHires: number;
  exits: number;
  attritionRate: number;
  totalPayroll: string;
  complianceStatus: { filed: number; pending: number; total: number };
}

export const BranchSnapshot = ({ data }: { data: SnapshotData }) => {
  const metrics = [
    {
      label: 'Total Headcount',
      value: data.headcount,
      icon: Users,
      color: 'blue',
    },
    {
      label: 'New Hires',
      value: data.newHires,
      icon: UserPlus,
      color: 'green',
    },
    {
      label: 'Exits',
      value: data.exits,
      icon: UserMinus,
      color: 'red',
    },
    {
      label: 'Attrition Rate',
      value: data.attritionRate + '%',
      icon: data.attritionRate < 10 ? TrendingDown : TrendingUp,
      color: data.attritionRate < 10 ? 'green' : 'orange',
    },
    {
      label: 'Total Payroll',
      value: data.totalPayroll,
      icon: DollarSign,
      color: 'blue',
    },
    {
      label: 'Compliance Status',
      value: `${Math.round((data.complianceStatus.filed / data.complianceStatus.total) * 100)}%`,
      icon: ShieldCheck,
      color: 'green',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500">{metric.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${colorMap[metric.color as keyof typeof colorMap]}`}>
              <metric.icon className="w-4 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};