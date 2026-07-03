import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ALL_BRANCHES_VALUE } from "../constants/executiveDashboard.constants";
import { getBranches, getExecutiveDashboardData } from "../services/executiveDashboardApi";
import type { BranchScope } from "../types/executiveDashboard.types";

export function useExecutiveDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const branches = getBranches();
  const selectedBranchId = searchParams.get("branch_id") ?? ALL_BRANCHES_VALUE;

  const scope: BranchScope = useMemo(() => {
    if (selectedBranchId === ALL_BRANCHES_VALUE) {
      return {
        branchIds: branches.map((branch) => branch.id),
        label: "All Branches",
      };
    }

    const selectedBranch = branches.find((branch) => branch.id === selectedBranchId);

    return {
      branchIds: selectedBranch ? [selectedBranch.id] : branches.map((branch) => branch.id),
      label: selectedBranch?.name ?? "All Branches",
    };
  }, [branches, selectedBranchId]);

  const data = useMemo(() => getExecutiveDashboardData(scope), [scope]);

  function setSelectedBranch(branchId: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (branchId === ALL_BRANCHES_VALUE) {
        next.delete("branch_id");
      } else {
        next.set("branch_id", branchId);
      }

      return next;
    });
  }

  return {
    branches,
    data,
    selectedBranchId,
    setSelectedBranch,
  };
}
