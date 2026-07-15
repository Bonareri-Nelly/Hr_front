import type { ExecutiveAlert } from "../types/executiveDashboard.types";

export default function ExecutiveAlerts({ alerts }: { alerts: ExecutiveAlert[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Outlier & Exception Alerts</h3>
        <button className="panel-action" type="button">Configure digest</button>
      </div>
      <div className="panel-body alert-grid">
        {alerts.map((alert) => (
          <div className="note" key={alert.id}>
            <span className={`pill pill-${alert.tone}`}>{alert.tone}</span>
            <div className="activity-title alert-title">{alert.title}</div>
            <div className="activity-meta">{alert.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
