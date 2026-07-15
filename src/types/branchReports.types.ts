export interface BranchSnapshotData {
  headcount: number;
  newHires: number;
  exits: number;
  attritionRate: number;
  totalPayroll: string;
  complianceStatus: { filed: number; pending: number; total: number };
}

export interface WorkforceData {
  headcountTrend: { month: string; total: number; newHires: number; exits: number }[];
  averageTenure: number;
  turnoverRate: number;
}

export interface PayrollData {
  trend: { month: string; amount: number }[];
  breakdown: { category: string; amount: number; percentage: number }[];
  budget: { actual: number; budget: number; variance: number };
}

export interface ComplianceData {
  status: { category: string; filed: number; pending: number; total: number }[];
  flags: { issue: string; status: 'overdue' | 'pending' | 'completed' }[];
  overallScore: number;
}

export interface BenefitsData {
  summary: { category: string; utilization: number; cost: number; eligible: number }[];
  totalCost: number;
  avgUtilization: number;
}

export interface PerformanceData {
  overallAvg: number;
  trend: { cycle: string; avgScore: number }[];
}