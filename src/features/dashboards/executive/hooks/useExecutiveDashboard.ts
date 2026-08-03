import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBranches, getExecutiveDashboardData } from "../services/executiveDashboardApi";
import type { BranchScope } from "../types/executiveDashboard.types";

export function useExecutiveDashboard() {
  const branchQuery = useQuery({ queryKey: ["executive", "branches"], queryFn: getBranches });
  const branches = branchQuery.data ?? [];

  const scope: BranchScope = useMemo(() => {
    return {
      branchIds: branches.length ? [branches[0].id] : [],
      label: branches[0]?.name ?? "Branch",
    };
  }, [branches]);

  const dashboardQuery = useQuery({ queryKey: ["executive", "dashboard", scope.branchIds], queryFn: () => getExecutiveDashboardData(scope) });

  return {
    branches,
    data: dashboardQuery.data,
    isLoading: branchQuery.isLoading || dashboardQuery.isLoading,
    error: branchQuery.error ?? dashboardQuery.error,
  };
}
