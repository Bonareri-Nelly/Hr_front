import { useCallback, useEffect, useState } from "react";
import { resources, type ApiRecord } from "@/services/api/resources";

interface UseBenefitsDataProps { role: string; branchId?: string; selectedBranch?: string; dateRange?: "month" | "quarter" | "year"; }
type BenefitsData = {
  totalEligible: number; totalEnrolled: number; enrollmentRate: number; enrollmentTrend: { totalEmployees: number; enrolled: number }; costTrend: { percentage: number; direction: "up" | "down" | "stable" };
  byCategory: Array<{ category: string; eligible: number; enrolled: number; rate: number; cost: number; costPerEmployee: number; trend: number }>;
  byBranch: Array<{ branchId: string; branchName: string; eligible: number; enrolled: number; rate: number; cost: number; costPerEmployee: number }>;
  costSummary: { total: number; employerCovered: number; employeeCovered: number; costPerEmployee: number; budget: number; actual: number; variance: number };
  trends: Array<{ date: string; enrolled: number; eligible: number; cost: number; costPerEmployee: number; newEnrollments: number; cancellations: number; budget: number }>;
  alerts: Array<{ type: "warning" | "info" | "success"; message: string; branchName?: string }>; categories: string[]; branches: Array<{ id: string; name: string; code: string; location: string; managerId: string }>;
};

const number = (value: unknown) => Number(value ?? 0);
const str = (item: ApiRecord, key: string) => String(item[key] ?? "");
const list = (value: unknown) => Array.isArray(value) ? value as ApiRecord[] : [];

export const useBenefitsData = ({ branchId, selectedBranch }: UseBenefitsDataProps) => {
  const [data, setData] = useState<BenefitsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([resources.benefitPlans.list(), resources.benefitEnrollments.list(), resources.employees.list(), resources.branches.list(), resources.benefitContributions.list()])
      .then(([plans, enrollments, employees, branches, contributions]) => {
        if (!active) return;
        const approved = enrollments.filter((item) => ["approved", "active", "enrolled"].includes(str(item, "status").toLowerCase()));
        const categoryMap = new Map<string, { enrolled: number; cost: number }>();
        plans.forEach((plan) => categoryMap.set(str(plan, "category") || str(plan, "name") || "Uncategorised", { enrolled: 0, cost: 0 }));
        approved.forEach((enrollment) => {
          const plan = plans.find((item) => String(item.id) === str(enrollment, "benefit_plan") || String(item.id) === str(enrollment, "plan"));
          const category = plan ? (str(plan, "category") || str(plan, "name") || "Uncategorised") : "Uncategorised";
          const current = categoryMap.get(category) ?? { enrolled: 0, cost: 0 };
          current.enrolled += 1; categoryMap.set(category, current);
        });
        contributions.forEach((contribution) => {
          const enrollment = enrollments.find((item) => String(item.id) === str(contribution, "enrollment"));
          const plan = enrollment
            ? plans.find((item) => String(item.id) === str(enrollment, "benefit_plan") || String(item.id) === str(enrollment, "plan"))
            : undefined;
          const category = plan ? (str(plan, "category") || str(plan, "name") || "Uncategorised") : "Uncategorised";
          const current = categoryMap.get(category) ?? { enrolled: 0, cost: 0 };
          current.cost += number(contribution.amount ?? contribution.employer_contribution ?? contribution.total_amount); categoryMap.set(category, current);
        });
        const eligible = employees.length;
        const byCategory = [...categoryMap].map(([category, item]) => ({ category, eligible, enrolled: item.enrolled, rate: eligible ? item.enrolled / eligible * 100 : 0, cost: item.cost, costPerEmployee: item.enrolled ? item.cost / item.enrolled : 0, trend: 0 }));
        const selected = selectedBranch && selectedBranch !== "all" ? selectedBranch : branchId;
        const visibleBranches = selected ? branches.filter((item) => String(item.id) === selected) : branches;
        const byBranch = visibleBranches.map((branch) => {
          const branchEmployees = employees.filter((employee) => str(employee, "branch") === String(branch.id));
          const branchEmployeeIds = new Set(branchEmployees.map((employee) => String(employee.id)));
          const branchEnrolled = approved.filter((enrollment) => branchEmployeeIds.has(str(enrollment, "employee"))).length;
          return { branchId: String(branch.id), branchName: str(branch, "name"), eligible: branchEmployees.length, enrolled: branchEnrolled, rate: branchEmployees.length ? branchEnrolled / branchEmployees.length * 100 : 0, cost: 0, costPerEmployee: 0 };
        });
        const totalCost = byCategory.reduce((sum, item) => sum + item.cost, 0);
        setData({ totalEligible: eligible, totalEnrolled: approved.length, enrollmentRate: eligible ? approved.length / eligible * 100 : 0, enrollmentTrend: { totalEmployees: eligible, enrolled: approved.length }, costTrend: { percentage: 0, direction: "stable" }, byCategory, byBranch, costSummary: { total: totalCost, employerCovered: totalCost, employeeCovered: 0, costPerEmployee: approved.length ? totalCost / approved.length : 0, budget: 0, actual: totalCost, variance: 0 }, trends: [], alerts: [], categories: byCategory.map((item) => item.category), branches: branches.map((branch) => ({ id: String(branch.id), name: str(branch, "name"), code: str(branch, "code"), location: str(branch, "location"), managerId: str(branch, "manager") })) });
        setError(null);
      })
      .catch((reason) => active && setError(reason instanceof Error ? reason : new Error("Could not load benefit data.")))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [branchId, selectedBranch, refreshKey]);

  return { data, loading, error, refetch: useCallback(() => setRefreshKey((key) => key + 1), []) };
};
