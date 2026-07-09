import { CheckCircle, Clock, AlertCircle, UserX } from 'lucide-react';

interface LifecycleStageBadgeProps {
  stage: 'onboarding' | 'active' | 'notice_period' | 'offboarded';
}

const stageConfig = {
  onboarding: {
    label: 'Onboarding',
    icon: Clock,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  active: {
    label: 'Active',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  notice_period: {
    label: 'Notice Period',
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  offboarded: {
    label: 'Offboarding Complete',
    icon: UserX,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
};

export const LifecycleStageBadge = ({ stage }: LifecycleStageBadgeProps) => {
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};