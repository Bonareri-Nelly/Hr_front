import { BranchMetricTable } from "./ExecutiveDashboardPrimitives";
import type { ExecutiveDashboardData } from "../types/executiveDashboard.types";
import { formatCurrency } from "../utils/formatters";

export default function AttendanceLeaveOverview({ data }: { data: ExecutiveDashboardData }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Attendance & Leave</h3>
        <button className="panel-action" type="button">View branch detail</button>
      </div>
      <div className="panel-body section-stack">
        <div className="split-3">
          <div className="split-cell">
            <div className="metric-label">Absenteeism</div>
            <div className="metric-value">{data.summary.absenteeismRate}%</div>
          </div>
          <div className="split-cell">
            <div className="metric-label">Accrued leave</div>
            <div className="metric-value">{data.attendance.leaveLiabilityDays}</div>
          </div>
          <div className="split-cell">
            <div className="metric-label">Future exposure</div>
            <div className="metric-value compact-metric">{formatCurrency(data.attendance.leaveLiabilityCost)}</div>
          </div>
        </div>
        <BranchMetricTable rows={data.attendance.absenteeismByBranch} valueLabel="Absenteeism" suffix="%" />
      </div>
    </section>
  );
}
