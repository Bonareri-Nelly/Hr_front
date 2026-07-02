import React from 'react';

interface PayrollCostOverviewProps {
  data: {
    totalCost: number;
    trend: {
      labels: string[];
      values: number[];
    };
    breakdown: {
      grossSalary: number;
      statutoryDeductions: number;
      benefits: number;
      overtime: number;
    };
  };
}

const PayrollCostOverview: React.FC<PayrollCostOverviewProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const maxValue = Math.max(...data.trend.values, 0);
  const barHeight = (value: number) => (value / maxValue) * 100;

  const breakdownItems = [
    { label: 'Gross Salary', value: data.breakdown.grossSalary, color: '#3498db' },
    { label: 'Statutory Deductions', value: data.breakdown.statutoryDeductions, color: '#e74c3c' },
    { label: 'Benefits', value: data.breakdown.benefits, color: '#2ecc71' },
    { label: 'Overtime', value: data.breakdown.overtime, color: '#f39c12' }
  ];

  return (
    <div className="payroll-cost">
      <div className="summary-cards">
        <div className="card">
          <span className="card-label">Total Payroll Cost</span>
          <span className="card-value">{formatCurrency(data.totalCost)}</span>
          <span className="card-change">+3.2% from last month</span>
        </div>
        <div className="card">
          <span className="card-label">Average Salary</span>
          <span className="card-value">
            {formatCurrency(data.totalCost / 150)}
          </span>
          <span className="card-change">+1.5% from last month</span>
        </div>
        <div className="card">
          <span className="card-label">Cost per Employee</span>
          <span className="card-value">
            {formatCurrency(data.totalCost / 150)}
          </span>
          <span className="card-change">-0.8% from last month</span>
        </div>
      </div>

      <div className="chart-section">
        <h4>Payroll Trend</h4>
        <div className="trend-chart">
          <div className="bars">
            {data.trend.values.map((value, index) => (
              <div key={index} className="bar-group">
                <div 
                  className="bar" 
                  style={{ height: `${barHeight(value)}%` }}
                />
                <span className="bar-label">{data.trend.labels[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="breakdown-section">
        <h4>Cost Breakdown</h4>
        <div className="breakdown-items">
          {breakdownItems.map((item) => (
            <div key={item.label} className="breakdown-item">
              <div className="breakdown-label">
                <span 
                  className="color-dot" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill"
                  style={{ 
                    width: `${(item.value / data.totalCost) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              <span className="breakdown-value">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .payroll-cost {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
        }
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .card {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
        }
        .card-label {
          display: block;
          font-size: 0.85rem;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .card-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
        }
        .card-change {
          display: block;
          font-size: 0.85rem;
          color: #2ecc71;
          margin-top: 4px;
        }
        .chart-section {
          margin-bottom: 24px;
        }
        .chart-section h4 {
          margin-bottom: 12px;
          color: #2c3e50;
        }
        .trend-chart {
          height: 200px;
          padding: 16px 0;
        }
        .bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 100%;
          gap: 8px;
        }
        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          height: 100%;
        }
        .bar {
          width: 100%;
          max-width: 40px;
          background: #3498db;
          border-radius: 4px 4px 0 0;
          transition: height 0.3s ease;
          min-height: 4px;
        }
        .bar-label {
          font-size: 0.75rem;
          color: #7f8c8d;
          margin-top: 4px;
        }
        .breakdown-section h4 {
          margin-bottom: 12px;
          color: #2c3e50;
        }
        .breakdown-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .breakdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .breakdown-label {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 180px;
          font-size: 0.9rem;
          color: #2c3e50;
        }
        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        .breakdown-bar {
          flex: 1;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }
        .breakdown-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .breakdown-value {
          font-size: 0.9rem;
          font-weight: 500;
          color: #2c3e50;
          min-width: 100px;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default PayrollCostOverview;