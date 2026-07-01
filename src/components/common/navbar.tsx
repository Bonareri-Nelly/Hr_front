import { Bell, ChevronDown, HelpCircle, Search, Settings } from "lucide-react";
import { useMemo, useState } from "react";

const branches = ["Nairobi HQ", "Mombasa", "Kisumu", "Remote Units"];

export default function Navbar() {
  const [branchIndex, setBranchIndex] = useState(0);
  const branch = branches[branchIndex];

  const nextBranchLabel = useMemo(
    () => branches[(branchIndex + 1) % branches.length],
    [branchIndex],
  );

  return (
    <div className="topbar">
      <button
        aria-label={`Switch branch to ${nextBranchLabel}`}
        className="branch-selector"
        type="button"
        onClick={() => setBranchIndex((index) => (index + 1) % branches.length)}
      >
        <span>{branch}</span>
        <ChevronDown aria-hidden="true" size={15} />
      </button>

      <div className="breadcrumb">Executive Dashboard</div>

      <div className="topbar-spacer" />

      <span className="role-badge">Payroll Admin</span>

      <button className="icon-button" type="button" aria-label="Search">
        <Search aria-hidden="true" size={17} />
      </button>
      <button className="icon-button notification-button" type="button" aria-label="Notifications">
        <Bell aria-hidden="true" size={17} />
        <span className="notification-dot" />
      </button>
      <button className="icon-button" type="button" aria-label="Help">
        <HelpCircle aria-hidden="true" size={17} />
      </button>
      <button className="icon-button" type="button" aria-label="Settings">
        <Settings aria-hidden="true" size={17} />
      </button>

      <div className="avatar" aria-label="Angela Njeri">
        AN
      </div>
    </div>
  );
}
