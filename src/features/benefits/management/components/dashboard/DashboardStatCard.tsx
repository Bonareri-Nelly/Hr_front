// src/features/benefits/management/components/dashboard/DashboardStatCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: number | 'up' | 'down' | 'neutral';
  trendValue?: number;
  className?: string;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className = '',
}) => {
  // Determine trend direction and value
  let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
  let displayTrendValue: number | null = null;

  if (typeof trend === 'number') {
    if (trend > 0) {
      trendDirection = 'up';
      displayTrendValue = trend;
    } else if (trend < 0) {
      trendDirection = 'down';
      displayTrendValue = Math.abs(trend);
    }
  } else if (typeof trend === 'string') {
    trendDirection = trend as 'up' | 'down' | 'neutral';
    if (trendValue !== undefined) {
      displayTrendValue = trendValue;
    }
  }

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trendDirection !== 'neutral' && displayTrendValue !== null && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <span className={getTrendColor()}>{getTrendIcon()}</span>
            <span className={getTrendColor()}>
              {displayTrendValue.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};