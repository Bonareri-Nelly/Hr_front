export interface FilterState {
  timeRange: 'monthly' | 'quarterly' | 'annual';
  branch: string;
  department: string;
  dateRange: { start: string; end: string };
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  color: 'blue' | 'gold' | 'green' | 'purple' | 'orange' | 'teal';
}

export interface HeadcountData {
  month: string;
  total: number;
  newHires: number;
  exits: number;
}

export interface DepartmentData {
  name: string;
  headcount: number;
  spanOfControl: number;
}

export interface PayrollData {
  month: string;
  amount: number;
}

export interface ComplianceData {
  category: string;
  filed: number;
  pending: number;
  total: number;
}

export interface BenefitData {
  category: string;
  utilization: number;
  cost: number;
  eligible: number;
}

export interface PerformanceDistribution {
  rating: string;
  count: number;
  percentage: number;
}