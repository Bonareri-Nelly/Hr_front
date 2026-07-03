import type { ExecutiveAlert } from "../types/executiveDashboard.types";

export default function PredictiveInsights({ insights }: { insights: ExecutiveAlert[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Predictive & Proactive Insights</h3>
        <button className="panel-action" type="button">Pin widgets</button>
      </div>
      <div className="panel-body">
        <ul className="activity-list">
          {insights.map((insight) => (
            <li className="activity-item" key={insight.id}>
              <span className="activity-dot" />
              <div>
                <div className="activity-title">{insight.title}</div>
                <div className="activity-meta">{insight.detail}</div>
              </div>
              <span className={`pill pill-${insight.tone}`}>{insight.tone}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
