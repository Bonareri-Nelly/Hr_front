import { ElementType } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: ElementType;  // 👈 changed from 'LucideIcon' to 'ElementType'
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
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          
           
          <p className="text-lg font-bold text-gray-900 mt-1">{value}</p> 
        </div>
        <div className={`p-3 rounded-full ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className={`text-xs font-medium mt-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change} {isPositive ? '↑' : '↓'} from last month
      </p>
    </div>
  );
};