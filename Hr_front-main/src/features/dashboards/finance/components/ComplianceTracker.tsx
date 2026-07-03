import React from 'react';

type TaxStatus = {
  filed: boolean;
};

type ComplianceDeadline = {
  type: string;
  description: string;
  dueDate: Date | string;
};

interface ComplianceTrackerProps {
  data: {
    taxStatus: TaxStatus[];
    flags: number;
    deadlines: ComplianceDeadline[];
  };
}

const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({ data }) => {
  return (
    <div className="compliance-tracker">
      <div className="summary">
        <div className="stat">
          <span className="stat-label">Tax Filing Status</span>
          <span className="stat-value">
            {data.taxStatus.filter((taxStatus) => taxStatus.filed).length}/{data.taxStatus.length} Filed
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Compliance Flags</span>
          <span className="stat-value danger">{data.flags}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Upcoming Deadlines</span>
          <span className="stat-value">{data.deadlines.length}</span>
        </div>
      </div>
      
      <div className="deadlines">
        <h4>Upcoming Deadlines</h4>
        {data.deadlines.map((deadline, index) => (
          <div key={index} className="deadline-item">
            <span className="deadline-type">{deadline.type}</span>
            <span>{deadline.description}</span>
            <span className="deadline-date">
              Due: {new Date(deadline.dueDate).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .compliance-tracker {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }
        .stat-label {
          display: block;
          font-size: 0.85rem;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .stat-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
        }
        .stat-value.danger {
          color: #e74c3c;
        }
        .deadlines h4 {
          margin-bottom: 12px;
          color: #2c3e50;
        }
        .deadline-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 0.9rem;
        }
        .deadline-type {
          font-weight: 600;
          color: #3498db;
          text-transform: uppercase;
          font-size: 0.8rem;
        }
        .deadline-date {
          color: #e67e22;
        }
      `}</style>
    </div>
  );
};

export default ComplianceTracker;
