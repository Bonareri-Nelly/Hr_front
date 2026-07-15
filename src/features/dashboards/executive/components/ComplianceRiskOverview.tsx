import { BranchMetricTable, TrendBars } from "./ExecutiveDashboardPrimitives";
import type { ExecutiveDashboardData } from "../types/executiveDashboard.types";
import { Link } from "react-router-dom";

export default function ComplianceRiskOverview({ data }: { data: ExecutiveDashboardData }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Compliance & Risk</h3>
        <Link className="panel-action" to="/security-audit">Open audit map</Link>
      </div>
      <div className="panel-body section-stack">
        <div>
          <div className="eyebrow">Disciplinary case trend</div>
          <TrendBars points={data.compliance.disciplinaryTrend} />
        </div>
        <BranchMetricTable rows={data.compliance.flags} valueLabel="Open flags" />
        <BranchMetricTable rows={data.compliance.auditHeatmap} valueLabel="Audit score" suffix="%" />
      </div>
    </section>
  );
}
