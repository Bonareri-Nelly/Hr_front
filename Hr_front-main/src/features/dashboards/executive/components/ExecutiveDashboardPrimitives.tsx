import type { BranchMetric, TrendPoint } from "../types/executiveDashboard.types";

export function TrendBars({ points, suffix = "" }: { points: TrendPoint[]; suffix?: string }) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <div className="mini-chart" aria-label="Trend chart">
      {points.map((point) => (
        <div className="mini-bar" key={point.label}>
          <span style={{ height: `${Math.max((point.value / maxValue) * 100, 8)}%` }} />
          <small>{point.label}</small>
          <em>
            {point.value}
            {suffix}
          </em>
        </div>
      ))}
    </div>
  );
}

export function BranchMetricTable({
  rows,
  valueLabel,
  suffix = "",
}: {
  rows: BranchMetric[];
  valueLabel: string;
  suffix?: string;
}) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Branch</th>
            <th>{valueLabel}</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.branchId}-${row.branchName}-${valueLabel}`}>
              <td>{row.branchName}</td>
              <td>
                {row.value}
                {suffix}
              </td>
              <td>
                <span className={`pill pill-${row.status}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProgressStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="run-item">
      <div>
        <div className="run-title">{label}</div>
        <div className="run-meta">{value}%</div>
      </div>
      <div className="progress" aria-label={`${label} progress`}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
