import React from 'react';

interface BudgetManagementProps {
  data: {
    total: {
      allocated: number;
      spent: number;
      remaining: number;
      variance: number;
      variancePercent: number;
    };
    utilization: Array<{
      category: string;
      allocated: number;
      spent: number;
    }>;
    burnRate: number;
    projectedOverspend: number;
  };
}

const BudgetManagement: React.FC<BudgetManagementProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="budget-management">
      <div className="budget-summary">
        <div className="budget-card">
          <span className="budget-label">Allocated</span>
          <span className="budget-value">{formatCurrency(data.total.allocated)}</span>
        </div>
        <div className="budget-card">
          <span className="budget-label">Spent</span>
          <span className="budget-value">{formatCurrency(data.total.spent)}</span>
        </div>
        <div className="budget-card">
          <span className="budget-label">Remaining</span>
          <span className="budget-value">{formatCurrency(data.total.remaining)}</span>
        </div>
        <div className="budget-card">
          <span className="budget-label">Variance</span>
          <span className={`budget-value ${data.total.variance > 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(data.total.variance)}
          </span>
        </div>
      </div>

      <div className="utilization-section">
        <h4>Budget Utilization</h4>
        {data.utilization.map((item, index) => (
          <div key={index} className="utilization-item">
            <div className="utilization-label">
              <span>{item.category}</span>
              <span>{formatCurrency(item.spent)} / {formatCurrency(item.allocated)}</span>
            </div>
            <div className="utilization-bar">
              <div 
                className="utilization-fill"
                style={{ width: `${(item.spent / item.allocated) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="budget-metrics">
        <div className="metric">
          <span className="metric-label">Burn Rate</span>
          <span className="metric-value">{(data.burnRate * 100).toFixed(0)}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Projected Overspend</span>
          <span className="metric-value danger">{formatCurrency(data.projectedOverspend)}</span>
        </div>
      </div>

      <style>{`
        .budget-management {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
        }
        .budget-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .budget-card {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }
        .budget-label {
          display: block;
          font-size: 0.85rem;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .budget-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
        }
        .budget-value.positive {
          color: #2ecc71;
        }
        .budget-value.negative {
          color: #e74c3c;
        }
        .utilization-section h4 {
          margin-bottom: 12px;
          color: #2c3e50;
        }
        .utilization-item {
          margin-bottom: 12px;
        }
        .utilization-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }
        .utilization-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }
        .utilization-fill {
          height: 100%;
          background: #3498db;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .budget-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        .metric {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }
        .metric-label {
          display: block;
          font-size: 0.85rem;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .metric-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
        }
        .metric-value.danger {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
};

export default BudgetManagement;