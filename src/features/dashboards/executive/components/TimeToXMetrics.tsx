import type { ExecutiveDashboardData } from "../types/executiveDashboard.types";

export default function TimeToXMetrics({ data }: { data: ExecutiveDashboardData }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Time-to-X Metrics</h3>
        <button className="panel-action" type="button">Compare periods</button>
      </div>
      <div className="panel-body">
        <div className="split-3">
          <div className="split-cell">
            <div className="metric-label">Time to hire</div>
            <div className="metric-value">{data.timeToX.timeToHireDays}d</div>
          </div>
          <div className="split-cell">
            <div className="metric-label">Productivity</div>
            <div className="metric-value">{data.timeToX.timeToProductivityDays}d</div>
          </div>
          <div className="split-cell">
            <div className="metric-label">Mobility</div>
            <div className="metric-value">{data.timeToX.internalMobilityRate}%</div>
          </div>
        </div>
      </div>
    </section>
  );
}
