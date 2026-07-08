import { ElementType } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: ElementType;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
};

export const MetricCard = ({ title, value, change, icon: Icon, color }: MetricCardProps) => {
  const isPositive = !change.startsWith('-');
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>  {/* was text-sm */}
          <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>  {/* was text-2xl */}
        </div>
        <div className={`p-2 rounded-full ${colorMap[color]}`}>  {/* was p-3 */}
          <Icon className="w-4 h-4" />  {/* was w-5 h-5 */}
        </div>
      </div>
      <p className={`text-xs font-medium mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change} {isPositive ? '↑' : '↓'} from last month
      </p>
    </div>
  );
};