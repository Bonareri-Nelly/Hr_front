export type LifecycleStage = 'onboarding' | 'active' | 'notice_period' | 'offboarded';

export type MilestoneType = 
  | 'hire' 
  | 'probation' 
  | 'promotion' 
  | 'transfer' 
  | 'performance' 
  | 'benefits' 
  | 'salary' 
  | 'leave' 
  | 'offboarding';

export interface Milestone {
  id: string;
  type: MilestoneType;
  date: string;
  title: string;
  description: string;
  moduleLink: string;
  details?: Record<string, any>;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  branch: string;
  role: string;
  stage: LifecycleStage;
  startDate: string;
  tenure: string;
  milestones: Milestone[];
}

export interface AnalyticsData {
  avgTimeToPromotion: string;
  avgTenure: string;
  attritionByStage: { stage: string; percentage: number }[];
  onboardingCompletionRate: number;
  timeToProductivity: string;
}

export interface EmployeeLifecycleData {
  employees: Employee[];
  analytics: AnalyticsData;
}