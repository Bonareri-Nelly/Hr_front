// src/features/benefits/types/index.ts
export interface BenefitType {
  id: string;
  name: string;
  category: string;
  description?: string;
  employerCoveredPercentage: number;
  employeeCoveredPercentage: number;
  eligibilityRule: {
    type: 'org-wide' | 'branch' | 'job-grade' | 'department' | 'manual';
    criteria: string[];
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BenefitsSummary {
  totalEligible: number;
  totalEnrolled: number;
  enrollmentRate: number;
  enrollmentTrend: {
    totalEmployees: number;
    enrolled: number;
  };
  costTrend: {
    percentage: number;
    direction: 'up' | 'down' | 'stable';
  };
  byCategory: CategoryStats[];
  byBranch: BranchStats[];
  costSummary: CostSummary;
  trends: TrendData[];
  alerts: Alert[];
  categories: string[];
  branches: Branch[];
}

export interface CategoryStats {
  category: string;
  eligible: number;
  enrolled: number;
  rate: number;
  cost: number;
  costPerEmployee: number;
  trend: number;
}

export interface BranchStats {
  branchId: string;
  branchName: string;
  eligible: number;
  enrolled: number;
  rate: number;
  cost: number;
  costPerEmployee: number;
}

export interface CostSummary {
  total: number;
  employerCovered: number;
  employeeCovered: number;
  costPerEmployee: number;
  budget: number;
  actual: number;
  variance: number;
}

export interface TrendData {
  date: string;
  enrolled: number;
  eligible: number;
  cost: number;
  costPerEmployee: number;
  newEnrollments: number;
  cancellations: number;
  budget: number;
}

export interface Alert {
  type: 'warning' | 'info' | 'success';
  message: string;
  branchName?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  managerId: string;
}

export interface DashboardStat {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface EnrollmentRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  benefitId: string;
  benefitName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  comments?: string;
}

export interface EmployeeBenefits {
  employeeId: string;
  employeeName: string;
  branchId: string;
  enrollments: {
    benefitId: string;
    benefitName: string;
    category: string;
    enrollmentDate: string;
    status: 'active' | 'pending' | 'cancelled';
  }[];
}
