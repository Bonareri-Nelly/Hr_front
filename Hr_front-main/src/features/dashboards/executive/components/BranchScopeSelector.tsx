import { ALL_BRANCHES_VALUE } from "../constants/executiveDashboard.constants";
import type { Branch } from "../types/executiveDashboard.types";

type BranchScopeSelectorProps = {
  branches: Branch[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
};

export default function BranchScopeSelector({
  branches,
  selectedBranchId,
  onBranchChange,
}: BranchScopeSelectorProps) {
  return (
    <label className="field-control">
      <span className="eyebrow">Branch scope</span>
      <select
        className="select-control"
        value={selectedBranchId}
        onChange={(event) => onBranchChange(event.target.value)}
      >
        <option value={ALL_BRANCHES_VALUE}>All Branches</option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </label>
  );
}
