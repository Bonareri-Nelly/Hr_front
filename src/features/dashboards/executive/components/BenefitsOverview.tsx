import { BranchMetricTable, ProgressStat, TrendBars } from "./ExecutiveDashboardPrimitives";
import type { ExecutiveDashboardData } from "../types/executiveDashboard.types";
import { Link } from "react-router-dom";

export default function BenefitsOverview({ data }: { data: ExecutiveDashboardData }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Benefits</h3>
        <Link className="panel-action" to="/benefits">Analyze cost</Link>
      </div>
      <div className="panel-body section-stack">
        <ProgressStat label="Enrollment rate" value={data.benefits.enrollmentRate} />
        <div>
          <div className="eyebrow">Benefits cost trend</div>
          <TrendBars points={data.benefits.costTrend} suffix="M" />
        </div>
        <BranchMetricTable rows={data.benefits.branchEnrollment} valueLabel="Enrollment" suffix="%" />
      </div>
    </section>
  );
}
