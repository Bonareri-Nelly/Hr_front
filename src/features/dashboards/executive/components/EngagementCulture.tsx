import { BranchMetricTable, ProgressStat, TrendBars } from "./ExecutiveDashboardPrimitives";
import type { ExecutiveDashboardData } from "../types/executiveDashboard.types";

export default function EngagementCulture({ data }: { data: ExecutiveDashboardData }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Engagement & Culture</h3>
        <button className="panel-action" type="button">View survey</button>
      </div>
      <div className="panel-body section-stack">
        <ProgressStat label="Engagement / eNPS score" value={data.engagement.enps} />
        <BranchMetricTable rows={data.engagement.branchComparison} valueLabel="eNPS" />
        <div>
          <div className="eyebrow">Diversity & inclusion</div>
          <TrendBars points={data.engagement.diversity} suffix="%" />
        </div>
      </div>
    </section>
  );
}
