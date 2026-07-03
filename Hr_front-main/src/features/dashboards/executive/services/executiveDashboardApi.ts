import { branches } from "../constants/executiveDashboard.constants";
import type { BranchScope, ExecutiveDashboardData } from "../types/executiveDashboard.types";

const scopedBranchNames = (scope: BranchScope) =>
  branches.filter((branch) => scope.branchIds.includes(branch.id)).map((branch) => branch.name);

export function getBranches() {
  return branches;
}

export function getExecutiveDashboardData(scope: BranchScope): ExecutiveDashboardData {
  const branchNames = scopedBranchNames(scope);
  const primaryBranchName = branchNames[0] ?? "No branch";

  return {
    scope,
    summary: {
      headcount: 248,
      payrollCost: 18600000,
      payrollRevenuePercent: 24.8,
      attritionRate: 7.4,
      performanceCompletion: 82,
      absenteeismRate: 3.1,
    },
    workforce: {
      hiresTrend: [
        { label: "Jan", value: 8 },
        { label: "Feb", value: 10 },
        { label: "Mar", value: 7 },
        { label: "Apr", value: 12 },
        { label: "May", value: 9 },
        { label: "Jun", value: 14 },
      ],
      exitsTrend: [
        { label: "Jan", value: 3 },
        { label: "Feb", value: 4 },
        { label: "Mar", value: 2 },
        { label: "Apr", value: 5 },
        { label: "May", value: 4 },
        { label: "Jun", value: 6 },
      ],
      attritionRanking: [
        { branchId: "eldoret", branchName: primaryBranchName, value: 7.4, status: "warning" },
      ],
    },
    payroll: {
      costTrend: [
        { label: "Jan", value: 15.8 },
        { label: "Feb", value: 16.1 },
        { label: "Mar", value: 16.4 },
        { label: "Apr", value: 17.2 },
        { label: "May", value: 17.8 },
        { label: "Jun", value: 18.6 },
      ],
      budgetActual: { budget: 19.4, actual: 18.6 },
      overtimeTrend: [
        { label: "Jan", value: 0.8 },
        { label: "Feb", value: 0.9 },
        { label: "Mar", value: 1.1 },
        { label: "Apr", value: 1.4 },
        { label: "May", value: 1.2 },
        { label: "Jun", value: 1.6 },
      ],
      branchCosts: [
        { branchId: "eldoret", branchName: primaryBranchName, value: 18.6, status: "info" },
      ],
    },
    performance: {
      ratingDistribution: [
        { label: "1", value: 4 },
        { label: "2", value: 9 },
        { label: "3", value: 38 },
        { label: "4", value: 34 },
        { label: "5", value: 15 },
      ],
      branchRanking: [
        { branchId: "eldoret", branchName: primaryBranchName, value: 82, status: "success" },
      ],
    },
    attendance: {
      absenteeismByBranch: [
        { branchId: "eldoret", branchName: primaryBranchName, value: 3.1, status: "success" },
      ],
      leaveLiabilityDays: 1840,
      leaveLiabilityCost: 6200000,
    },
    compliance: {
      disciplinaryTrend: [
        { label: "Jan", value: 4 },
        { label: "Feb", value: 3 },
        { label: "Mar", value: 6 },
        { label: "Apr", value: 5 },
        { label: "May", value: 4 },
        { label: "Jun", value: 7 },
      ],
      flags: [
        { branchId: "eldoret", branchName: "Expiring contracts", value: 12, status: "warning" },
        { branchId: "eldoret", branchName: "Certification renewals", value: 8, status: "info" },
      ],
      auditHeatmap: [
        { branchId: "eldoret", branchName: primaryBranchName, value: 91, status: "success" },
      ],
    },
    benefits: {
      enrollmentRate: 76,
      costTrend: [
        { label: "Jan", value: 2.1 },
        { label: "Feb", value: 2.2 },
        { label: "Mar", value: 2.3 },
        { label: "Apr", value: 2.4 },
        { label: "May", value: 2.4 },
        { label: "Jun", value: 2.6 },
      ],
      branchEnrollment: [
        { branchId: "eldoret", branchName: primaryBranchName, value: 76, status: "success" },
      ],
    },
    approvals: [
      {
        id: "senior-hire-001",
        title: "Senior finance hire above approved band",
        branchName: primaryBranchName,
        value: "KES 720K annual impact",
        type: "Senior hire",
      },
      {
        id: "budget-exception-001",
        title: "Overtime exception above monthly threshold",
        branchName: primaryBranchName,
        value: "KES 410K variance",
        type: "Budget exception",
      },
    ],
    insights: [
      {
        id: "payroll-outlier",
        title: `${primaryBranchName} payroll cost is trending 8% above plan`,
        detail: "Review overtime concentration and senior hire timing before quarter close.",
        tone: "warning",
      },
      {
        id: "attrition-risk",
        title: "Operations attrition risk is rising",
        detail: "Exit velocity increased across the last two months. Drill into branch detail before approving new budget.",
        tone: "danger",
      },
      {
        id: "audit-health",
        title: "Audit readiness remains healthy",
        detail: "Contract and certification gaps are visible but below escalation threshold.",
        tone: "success",
      },
    ],
    engagement: {
      enps: 42,
      branchComparison: [
        { branchId: "eldoret", branchName: primaryBranchName, value: 42, status: "success" },
      ],
      diversity: [
        { label: "Women leaders", value: 38 },
        { label: "Internal promotions", value: 22 },
        { label: "Youth employment", value: 31 },
      ],
    },
    timeToX: {
      timeToHireDays: 28,
      timeToProductivityDays: 46,
      internalMobilityRate: 14,
    },
    financialHr: {
      revenuePerEmployee: 580000,
      costPerHireTrend: [
        { label: "Q1", value: 128 },
        { label: "Q2", value: 136 },
        { label: "Q3", value: 132 },
        { label: "Q4", value: 141 },
      ],
      trainingRetention: [
        { label: "No L&D", value: 68 },
        { label: "Core", value: 79 },
        { label: "Advanced", value: 87 },
      ],
    },
  };
}
