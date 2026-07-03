import React from 'react';

interface BenefitsCostTrackingProps {
  data: {
    enrollment: {
      medical: number;
      dental: number;
      vision: number;
      life: number;
    };
    costTrend: {
      labels: string[];
      values: number[];
    };
  };
}

const BenefitsCostTracking: React.FC<BenefitsCostTrackingProps> = ({ data }) => {
  const maxValue = Math.max(...data.costTrend.values, 0);
  const barHeight = (value: number) => (value / maxValue) * 100;

  return (
    <div className="benefits-cost">
      <div className="enrollment-stats">
        <h4>Enrollment Stats</h4>
        <div className="enrollment-grid">
          <div className="enrollment-card">
            <span className="enrollment-label">Medical</span>
            <span className="enrollment-value">{data.enrollment.medical}</span>
          </div>
          <div className="enrollment-card">
            <span className="enrollment-label">Dental</span>
            <span className="enrollment-value">{data.enrollment.dental}</span>
          </div>
          <div className="enrollment-card">
            <span className="enrollment-label">Vision</span>
            <span className="enrollment-value">{data.enrollment.vision}</span>
          </div>
          <div className="enrollment-card">
            <span className="enrollment-label">Life</span>
            <span className="enrollment-value">{data.enrollment.life}</span>
          </div>
        </div>
      </div>

      <div className="cost-trend">
        <h4>Cost Trend</h4>
        <div className="trend-chart">
          <div className="bars">
            {data.costTrend.values.map((value, index) => (
              <div key={index} className="bar-group">
                <div 
                  className="bar" 
                  style={{ height: `${barHeight(value)}%` }}
                />
                <span className="bar-label">{data.costTrend.labels[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .benefits-cost {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
        }
        .enrollment-stats h4, .cost-trend h4 {
          margin-bottom: 12px;
          color: #2c3e50;
        }
        .enrollment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }
        .enrollment-card {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }
        .enrollment-label {
          display: block;
          font-size: 0.85rem;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .enrollment-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
        }
        .trend-chart {
          height: 150px;
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
          background: #2ecc71;
          border-radius: 4px 4px 0 0;
          transition: height 0.3s ease;
          min-height: 4px;
        }
        .bar-label {
          font-size: 0.75rem;
          color: #7f8c8d;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default BenefitsCostTracking;
