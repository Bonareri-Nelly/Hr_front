import React from 'react';

type Discrepancy = {
  type: string;
  description: string;
  severity: string;
  status: string;
};

interface ReconciliationPanelProps {
  data: {
    status: string;
    discrepancies: Discrepancy[];
    discrepanciesCount: number;
  };
}

const ReconciliationPanel: React.FC<ReconciliationPanelProps> = ({ data }) => {
  return (
    <div className="reconciliation-panel">
      <div className="status-banner">
        <span className="status-label">Reconciliation Status:</span>
        <span className={`status-value ${data.status}`}>
          {data.status.toUpperCase()}
        </span>
      </div>

      <div className="discrepancies">
        <h4>Discrepancies ({data.discrepanciesCount})</h4>
        {data.discrepancies.map((disc, index) => (
          <div key={index} className="discrepancy-item">
            <span className="discrepancy-type">{disc.type}</span>
            <span>{disc.description}</span>
            <span className={`severity ${disc.severity}`}>{disc.severity}</span>
            <span className={`status-badge ${disc.status}`}>{disc.status}</span>
          </div>
        ))}
      </div>

      <style>{`
        .reconciliation-panel {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
        }
        .status-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 24px;
        }
        .status-label {
          font-weight: 600;
          color: #2c3e50;
        }
        .status-value {
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 600;
        }
        .status-value.in-progress {
          background: #f39c12;
          color: white;
        }
        .status-value.completed {
          background: #2ecc71;
          color: white;
        }
        .status-value.flagged {
          background: #e74c3c;
          color: white;
        }
        .discrepancies h4 {
          margin-bottom: 12px;
          color: #2c3e50;
        }
        .discrepancy-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 0.9rem;
        }
        .discrepancy-type {
          font-weight: 600;
          color: #3498db;
          text-transform: uppercase;
          font-size: 0.8rem;
        }
        .severity {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .severity.low {
          background: #3498db;
          color: white;
        }
        .severity.medium {
          background: #f39c12;
          color: white;
        }
        .severity.high {
          background: #e74c3c;
          color: white;
        }
        .status-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-badge.open {
          background: #f39c12;
          color: white;
        }
        .status-badge.investigating {
          background: #3498db;
          color: white;
        }
        .status-badge.resolved {
          background: #2ecc71;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ReconciliationPanel;
