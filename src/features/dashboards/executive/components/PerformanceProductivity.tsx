import { BranchMetricTable, ProgressStat, TrendBars } from "./ExecutiveDashboardPrimitives";
import type { ExecutiveDashboardData } from "../types/executiveDashboard.types";

export default function PerformanceProductivity({ data }: { data: ExecutiveDashboardData }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Performance & Productivity</h3>
        <button className="panel-action" type="button">Compare</button>
      </div>
      <div className="panel-body section-stack">
        <ProgressStat label="Goal / KPI completion rate" value={data.summary.performanceCompletion} />
        <div>
          <div className="eyebrow">Rating distribution</div>
          <TrendBars points={data.performance.ratingDistribution} suffix="%" />
        </div>
        <BranchMetricTable rows={data.performance.branchRanking} valueLabel="Completion" suffix="%" />
      </div>
    </section>
  );
}
