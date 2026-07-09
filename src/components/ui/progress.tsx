// src/components/ui/progress.tsx
import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
  max?: number;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  className = '',
  indicatorClassName = 'bg-blue-500',
  max = 100,
}) => {
  const percentage = Math.min(100, (value / max) * 100);
  
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-700 ${className}`}>
      <div
        className={`h-full transition-all duration-300 ${indicatorClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};