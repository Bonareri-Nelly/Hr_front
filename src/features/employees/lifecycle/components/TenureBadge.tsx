import { Clock } from 'lucide-react';

interface TenureBadgeProps {
  startDate: string;
}

export const TenureBadge = ({ startDate }: TenureBadgeProps) => {
  const calculateTenure = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffInMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;

    if (years === 0) {
      return `${months} mos`;
    }
    return `${years} yr${years > 1 ? 's' : ''} ${months > 0 ? `${months} mos` : ''}`;
  };

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      <Clock className="w-3 h-3" />
      {calculateTenure(startDate)}
    </span>
  );
};