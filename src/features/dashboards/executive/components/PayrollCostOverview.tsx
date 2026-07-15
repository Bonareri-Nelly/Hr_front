import { BranchMetricTable, ProgressStat, TrendBars } from "./ExecutiveDashboardPrimitives";
import type { ExecutiveDashboardData } from "../types/executiveDashboard.types";
import { Link } from "react-router-dom";

export default function PayrollCostOverview({ data }: { data: ExecutiveDashboardData }) {
  const budgetUsage = Math.round((data.payroll.budgetActual.actual / data.payroll.budgetActual.budget) * 100);

  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Payroll & Cost</h3>
        <Link className="panel-action" to="/reports-analytics">Export PDF</Link>
      </div>
      <div className="panel-body section-stack">
        <div className="split-3">
          <div className="split-cell">
            <div className="metric-label">Payroll cost</div>
            <div className="metric-value">KES {(data.summary.payrollCost / 1000000).toFixed(1)}M</div>
          </div>
          <div className="split-cell">
            <div className="metric-label">% of revenue</div>
            <div className="metric-value">{data.summary.payrollRevenuePercent}%</div>
          </div>
          <div className="split-cell">
            <div className="metric-label">Budget usage</div>
            <div className="metric-value">{budgetUsage}%</div>
          </div>
        </div>
        <ProgressStat label="Budget vs actual payroll spend" value={budgetUsage} />
        <div className="grid-2col">
          <div>
            <div className="eyebrow">Payroll cost trend</div>
            <TrendBars points={data.payroll.costTrend} suffix="M" />
          </div>
          <div>
            <div className="eyebrow">Overtime cost trend</div>
            <TrendBars points={data.payroll.overtimeTrend} suffix="M" />
          </div>
        </div>
        <BranchMetricTable rows={data.payroll.branchCosts} valueLabel="Cost" suffix="M" />
      </div>
    </section>
  );
}
