export type Branch = {
  id: string;
  name: string;
};

export type BranchScope = {
  branchIds: string[];
  label: string;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type BranchMetric = {
  branchId: string;
  branchName: string;
  value: number;
  status: "success" | "warning" | "danger" | "info";
};

export type ExecutiveApproval = {
  id: string;
  title: string;
  branchName: string;
  value: string;
  type: string;
};

export type ExecutiveAlert = {
  id: string;
  title: string;
  detail: string;
  tone: "success" | "warning" | "danger" | "info";
};

export type ExecutiveDashboardData = {
  scope: BranchScope;
  summary: {
    headcount: number;
    payrollCost: number;
    payrollRevenuePercent: number;
    attritionRate: number;
    performanceCompletion: number;
    absenteeismRate: number;
  };
  workforce: {
    hiresTrend: TrendPoint[];
    exitsTrend: TrendPoint[];
    attritionRanking: BranchMetric[];
  };
  payroll: {
    costTrend: TrendPoint[];
    budgetActual: { budget: number; actual: number };
    overtimeTrend: TrendPoint[];
    branchCosts: BranchMetric[];
  };
  performance: {
    ratingDistribution: TrendPoint[];
    branchRanking: BranchMetric[];
  };
  attendance: {
    absenteeismByBranch: BranchMetric[];
    leaveLiabilityDays: number;
    leaveLiabilityCost: number;
  };
  compliance: {
    disciplinaryTrend: TrendPoint[];
    flags: BranchMetric[];
    auditHeatmap: BranchMetric[];
  };
  benefits: {
    enrollmentRate: number;
    costTrend: TrendPoint[];
    branchEnrollment: BranchMetric[];
  };
  approvals: ExecutiveApproval[];
  insights: ExecutiveAlert[];
  engagement: {
    enps: number;
    branchComparison: BranchMetric[];
    diversity: TrendPoint[];
  };
  timeToX: {
    timeToHireDays: number;
    timeToProductivityDays: number;
    internalMobilityRate: number;
  };
  financialHr: {
    revenuePerEmployee: number;
    costPerHireTrend: TrendPoint[];
    trainingRetention: TrendPoint[];
  };
};
