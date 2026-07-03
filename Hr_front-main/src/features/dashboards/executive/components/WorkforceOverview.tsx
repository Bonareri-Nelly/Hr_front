import { BranchMetricTable, TrendBars } from "./ExecutiveDashboardPrimitives";
import type { ExecutiveDashboardData } from "../types/executiveDashboard.types";

export default function WorkforceOverview({ data }: { data: ExecutiveDashboardData }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Workforce Overview</h3>
        <button className="panel-action" type="button">Drill down</button>
      </div>
      <div className="panel-body section-stack">
        <div className="split-3">
          <div className="split-cell">
            <div className="metric-label">Total headcount</div>
            <div className="metric-value">{data.summary.headcount}</div>
          </div>
          <div className="split-cell">
            <div className="metric-label">Attrition rate</div>
            <div className="metric-value">{data.summary.attritionRate}%</div>
          </div>
          <div className="split-cell">
            <div className="metric-label">Scope</div>
            <div className="metric-value compact-metric">{data.scope.label}</div>
          </div>
        </div>
        <div className="grid-2col">
          <div>
            <div className="eyebrow">Hires trend</div>
            <TrendBars points={data.workforce.hiresTrend} />
          </div>
          <div>
            <div className="eyebrow">Exits trend</div>
            <TrendBars points={data.workforce.exitsTrend} />
          </div>
        </div>
        <BranchMetricTable rows={data.workforce.attritionRanking} valueLabel="Turnover" suffix="%" />
      </div>
    </section>
  );
}
